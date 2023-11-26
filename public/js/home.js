

socket = io()
// var ctx = canvas.getContext('2d')
// camera = document.getElementById('camera')

let linkAPIAI, linkvideo
socket.on('data', data => {
    linkAPIAI = data.data[1]
    linkvideo = data.data[0]
})
socket.on('img', (data) => {
    data = JSON.parse(data)
    camera.src = data.url;


    fetch(linkAPIAI,
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ 'data': linkvideo + '/video' })
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                alert("Lỗi xử lý")
                window.location.href = "/"
            }
        }).then(jsonResponse => {
            img = document.getElementById('img')
            img.width = camera.width
            img.height = camera.height;
            document.getElementById('img').src = jsonResponse.image

        }
        ).catch((err) => console.log(err));



    // camera.onload = () => {
    //     canvas.width = camera.width;
    //     canvas.height = camera.height;
    //     ctx.drawImage(camera, 0, 0, canvas.width, canvas.height)
    // }

});
// fetch(linkAPIAI,
//     // fetch("https://5ba9-34-141-222-185.ngrok-free.app",
//     {
//         method: 'GET',
//         headers: {
//             'Content-type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify({ 'data': data.url })

//     }).then(res => {
//         if (res.ok) {
//             console.log(res);
//             return res.json()
//         } else {
//             alert("Lỗi xử lý")
//         }
//     }).then(jsonResponse => {
//         console.log(jsonResponse)
//         img = document.getElementById('img')
//         img.width = camera.width
//         img.height = camera.height;
//         img = document.getElementById('img').src = jsonResponse.image

//     }
//     ).catch((err) => console.error(err));