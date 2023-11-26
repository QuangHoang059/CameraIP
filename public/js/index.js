var button = document.getElementById("theButton");
var ipInput = document.getElementById("input");
var ipInputAPI = document.getElementById("inputAPI");

// Bắt sự kiện khi nút button được nhấn
button.addEventListener("click", function (event) {
    event.preventDefault()
    if (ipInput.checkValidity()) {
        fetch("/home",
            {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 'data': [ipInput.value, ipInputAPI.value] })
            }).then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    log("Lỗi xử lý")
                }
            })
            .then((req) => {
            })
            .catch((err) => console.error(err));
        window.location.href = "/home"
    } else {

        alert("Vui lòng nhập IP video hợp lệ.");
    }
})