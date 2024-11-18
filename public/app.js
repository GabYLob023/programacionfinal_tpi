const express = require("express");
const path = require("path");
const app = express();
const conectar = require("mysql");

// Configuración de la conexión a la base de datos
const conexion = conectar.createConnection({
    host: "localhost",
    database: "boletindigital",
    user: "root",
    password: ""
});

conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log("Conexión exitosa a la base de datos");
    }
});

// Configuración de la aplicación
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json()); // Para parsear JSON en solicitudes POST
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Ruta principal
app.get("/", (req, res) => {
    res.render("index");
});

// Registro de usuarios
app.post("/validar", function (req, res) {
    const { apellido_nombre, direccion, celular, nombre_usuario, password, dni, cuil, email } = req.body;

    let registrar = `
        INSERT INTO usuarios (nombre_usuario, email, password, apellido_nombre, dni, cuil, direccion, celular) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    conexion.query(registrar, [nombre_usuario, email, password, apellido_nombre, dni, cuil, direccion, celular], function (error, results) {
        if (error) {
            console.error("Error al insertar datos:", error);
            res.send("Hubo un error al registrar los datos");
        } else {
            console.log("Datos insertados correctamente");
            res.send("Usuario registrado exitosamente");
        }
    });
});

// Ruta para mostrar el panel de administración con los usuarios y sus roles
app.get("/admin", (req, res) => {
    let consulta = `
        SELECT usuarios.*, roles.nombre_rol FROM usuarios
        LEFT JOIN roles ON usuarios.id_roles = roles.id_roles
    `;

    conexion.query(consulta, function (error, resultados) {
        if (error) {
            console.error("Error al obtener los datos:", error);
            res.send("Hubo un error al obtener los datos de los usuarios");
        } else {
            res.render("admin", { usuarios: resultados });
        }
    });
});

// Ruta para asignar rol a un usuario
app.post("/asignarRol", (req, res) => {
  const { id_usuario, id_roles } = req.body;
  const usuario = {
    id_usuario,
    id_roles
  };

  // Verificar si el usuario existe
  let verificarUsuarioQuery = "SELECT * FROM usuarios WHERE id_usuario = ?";
  conexion.query(verificarUsuarioQuery, [id_usuario], (error, resultados) => {
    if (error) {
      console.error("Error al verificar el usuario:", error);
      return res.status(500).send("Error al verificar el usuario");
    } else if (resultados.length > 0) {
      // Verificar si el rol existe
      let verificarRolQuery = "SELECT * FROM roles WHERE id_roles = ?";
      conexion.query(verificarRolQuery, [id_roles], (error, resultados) => {
        if (error) {
          console.error("Error al verificar el rol:", error);
          return res.status(500).send("Error al verificar el rol");
        } else if (resultados.length > 0) {
          // Actualizar el rol en la tabla 'usuarios'
          let actualizarRolQuery = "UPDATE usuarios SET id_roles = ? WHERE id_usuario = ?";
          conexion.query(actualizarRolQuery, [id_roles, id_usuario], (updateError, updateResults) => {
            if (updateError) {
              console.error("Error al actualizar el rol:", updateError);
              return res.status(500).send("Error al actualizar el rol");
            }

            // Eliminar al usuario de la tabla 'alumnos'
            let eliminarAlumnoQuery = "DELETE FROM alumnos WHERE id_usuario = ?";
            conexion.query(eliminarAlumnoQuery, [id_usuario], (deleteError, deleteResults) => {
              if (deleteError) {
                console.error("Error al eliminar al usuario de la tabla 'alumnos':", deleteError);
                return res.status(500).send("Error al eliminar al usuario de la tabla 'alumnos'");
              }

              // Eliminar al usuario de la tabla 'alumnado'
              let eliminarAlumnoQuery2 = "DELETE FROM alumnado WHERE id_usuario = ?";
              conexion.query(eliminarAlumnoQuery2, [id_usuario], (deleteError, deleteResults) => {
                if (deleteError) {
                  console.error("Error al eliminar al usuario de la tabla 'alumnado':", deleteError);
                  return res.status(500).send("Error al eliminar al usuario de la tabla 'alumnado'");
                } else {
                  res.status(200).send("Rol actualizado y usuario movido a tabla alumnado");
                }
              });
            });
          });
        } else {
          res.status(404).send("Rol no encontrado");
        }
      });
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  });
});

// Ruta para eliminar usuario
app.delete('/eliminarUsuario/:id', (req, res) => {
  const id_usuario = req.params.id;

  // Verificar si el usuario existe
  let verificarUsuarioQuery = "SELECT * FROM usuarios WHERE id_usuario = ?";
  conexion.query(verificarUsuarioQuery, [id_usuario], (error, resultados) => {
    if (error) {
      console.error("Error al verificar el usuario:", error);
      return res.status(500).send("Error al verificar el usuario");
    } else if (resultados.length > 0) {
      // Eliminar de la tabla 'usuarios'
      let eliminarUsuarioQuery = "DELETE FROM usuarios WHERE id_usuario = ?";
      conexion.query(eliminarUsuarioQuery, [id_usuario], (error, resultados) => {
        if (error) {
          console.error("Error al eliminar el usuario:", error);
          return res.status(500).send("Error al eliminar el usuario");
        } else {
          // También eliminar de las tablas 'alumnos' y 'alumnado'
          let eliminarQuery = `
            DELETE FROM alumnos WHERE id_usuario = ?;
            DELETE FROM alumnado WHERE id_usuario = ?;
          `;
          conexion.query(eliminarQuery, [id_usuario, id_usuario], (error, resultados) => {
            if (error) {
              console.error("Error al eliminar al usuario de las tablas:", error);
              return res.status(500).send("Error al eliminar al usuario de las tablas");
            } else {
              res.status(200).send("Usuario eliminado correctamente");
            }
          });
        }
      });
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  });
});

// Ruta para mostrar formulario de edición (opcional)
app.get('/editarUsuario/:id', (req, res) => {
  const id_usuario = req.params.id;
  let obtenerUsuarioQuery = "SELECT * FROM usuarios WHERE id_usuario = ?";
  conexion.query(obtenerUsuarioQuery, [id_usuario], (error, resultados) => {
    if (error) {
      console.error("Error al obtener el usuario:", error);
      return res.send("Hubo un error al obtener el usuario");
    } else if (resultados.length > 0) {
      res.render("editarUsuario", { usuario: resultados[0] });
    } else {
      res.send("Usuario no encontrado");
    }
  });
});

// Ruta para actualizar usuario (opcional)
app.post('/editarUsuario/:id', (req, res) => {
  const id_usuario = req.params.id;
  const datos = req.body;
  let actualizarUsuarioQuery = "UPDATE usuarios SET ? WHERE id_usuario = ?";
  conexion.query(actualizarUsuarioQuery, [datos, id_usuario], (error, results) => {
    if (error) {
      console.error("Error al actualizar el usuario:", error);
      res.send("Error al actualizar el usuario");
    } else {
      res.redirect("/admin");
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(`El servidor está corriendo en: http://localhost:${PORT}`);
});