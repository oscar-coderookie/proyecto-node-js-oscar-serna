

deleteClient() = async (id) => {
    await fetch("http://localhost:3200/professors/" + id, {
        method: "DELETE",

        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });

    window.location.href = "/professors";
};
