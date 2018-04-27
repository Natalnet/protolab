const errorsController = require('../errorsController');
exports.criarProcesso = (req, res) => {
    let erros;
    if (req.body.vinculo === "Discente") {
        erros = errorsController.getErrosFormDiscente(req);
    } else if (req.body.vinculo === "Docente") {
        erros = errorsController.getErrosFormDocente(req);
    } else if (req.body.vinculo === "Servidor") {
        erros = errorsController.getErrosFormServidor(req);
    } else {
        erros = errorsController.getErrosFormExterno(req);
    }
    if (erros) {
        res.status(200).json({ status: false, erros: erros });
        return;
    }
    res.status(200).json({ status: "ok" });
};