const mongoose = require('mongoose');
const Orcamento = mongoose.model('Orcamento');
const errorControllerOrcamentos = require('./errorControllerOrcamentos');
const errorFileController = require('../processosController/errorsControllerProcessos/getErrorsFile');
const methods = require('../methods');
exports.criarOrcamento = (application, req, res) => {
    // Declaração de variaveis.
    let code;

    const erros = errorControllerOrcamentos.verificarErrosForm(application, req, res);
    if (erros) return res.status(200).json({ erroForm: true, erro: erros });

    const erroFiles = errorFileController.getErrorsFile(req);
    if (erroFiles.statusErroFile) return res.status(200).json(erroFiles);

    if (req.body.tipoServico === "impressao3d") {
        code = "3D";
        delete req.body.configPcb;
    } else if (req.body.tipoServico === "impressaoPCB") {
        code = "PCB";
    } else {
        return res.status(200).json({ erroServico: true, msg: "Você precisa selecionar um serviço" });
    }
    
    /* Atualizando variaveis remanecentes para salvar no banco. */
    req.body.dataAbertura = new Date();
    req.body.codigo = methods.start(`OR${code}`);
    req.body.processamento = [
        {
            status: "Enviado",
            msg: `O seu orçamento de codigo ${req.body.codigo} foi enviado.`,
            data: new Date()
        }
    ];
    req.body.urlArquivo = `./src/uploads/orcamentos/${req.body.codigo}/${req.body.codigo}${methods.getExt(req.files.arquivo)}`;


    /* Movendo arquivo enviado para a pasta dos processos. */
    methods.createDir(`./src/uploads/orcamentos/${req.body.codigo}`, (statusDir, erroDir) => {
        if (erroDir) return res.status(500).json({ msg: "Problema ao criar diretorio, tente novamente." });
        methods.salveFile(req.files.arquivo, req.body.urlArquivo, (statusFile, erroFile) => {
            if (erroFile) return res.status(500).json({ msg: "Problema ao criar arquivo, tente novamente." });
            /* Salvando dados no banco */
            const novoOrcamento = new Orcamento(req.body);
            novoOrcamento.save((err, data) => {
                if (err) return res.status(200).json({ status: false, msg: erro });
                return res.status(200).json({ status: true, codigo: req.body.codigo, email: req.body.email});
            });
        });
    });

};