
$(function () {
    
    const socket = io();
// obteniendo los elementos del DOM desde la interfaz
const $messageForm = $('#message-form');
const $messageBox = $('#message');
const $chat = $('#chat');

// obteniendo los elementos del DOM desde el NicknameForm 
const $nickForm = $("#nickForm");
const $nickError = $("#nickError");
const $nickname = $("#nickname");

// obtaining the usernames container DOM
const $users = $('#usernames');

$nickForm.submit(e => {
    e.preventDefault();
    socket.emit('new user', $nickname.val(), data => {
        if (data) {
            $('#nickWrap').hide();
             $('#contentWrap').show();
            } else {
                $nickError.html(`
                    <div class="alert alert-danger">
                      That username already exits.
                    </div>
                  `);
            }
            $nickname.val('');
    });
});
        // Eventos
$messageForm.submit( e => {
e.preventDefault();
socket.emit('send message', $messageBox.val());
$messageBox.val('');
return false;
});

socket.on('new message', function (data) {
  $chat.append('<b>' + data.nick + '</b>: ' + data.msg + ' <span class="timestamp">' + data.timestamp + '</span><br/>');
  $chat.append('<button class="mark-as-read" data-id="' + data.msgId + '">Marcar como leído</button><br/>');
});

    socket.on('usernames', data => {
        let html = '';
    for (let i = 0; i < data.length; i++) {
        html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
    }
    $users.html(html);
    });



    

      //Evento para el envío de imágenes
    //selecciona un elemento HTML con el id "image" 
    //y lo asigna a la variable
    const $imageBox = $('#image');
//se agrega un evento de envío al formulario
$messageForm.submit(e => {
  e.preventDefault();
  //verifica si se ha seleccionado algún archivo 
  //en el campo de entrada de archivos  $imageBox. 
  //Si la longitud de  files  es mayor que cero, 
  //significa que se ha seleccionado al menos un archivo. 
  if ($imageBox[0].files.length > 0) {
    //FileReader permite leer el contenido de los
    //archivos seleccionados
    const reader = new FileReader();
    //define un controlador de eventos que se 
    //ejecutará cuando la lectura del archivo haya finalizado
    reader.onloadend = () => {
      socket.emit('send image', reader.result);
    };
    //inicia la lectura del archivo seleccionado 
    //como una URL de datos. Esto convierte el archivo 
    //en una cadena codificada en base64 que se puede
    // enviar al servidor. 
    reader.readAsDataURL($imageBox[0].files[0]);
  } 
  //campo de entrada de mensajes
  $messageBox.val('');
  //campo de entrada de archivos
  $imageBox.val('');
});
 socket.on('new image', function (data) {
  $chat.append('<p><b>' + data.nick + '</b>:</p>');
  $chat.append('<img src="' + data.image + '" />');
  $chat.append('<span class="timestamp">' + data.timestamp + '</span>');
});


// Cuando se hace clic en el botón "Marcar como leído"
$('body').on('click', '.mark-as-read', function() {
  // Obtén el id del mensaje
  const messageId = $(this).data('id');
   // Emite un evento al servidor con el id del mensaje y la hora actual
   socket.emit('mark as read', { id: messageId, timestamp: new Date().toLocaleTimeString() });
});
})