const path = require('path');
exports.getErrorsFile = (req) =>{
    if(!req.files){
        return {statusErroFile:true,msg:`Você deve anexar algum arquivo`};
    }
    const sampleFile = req.files.arquivo;
    if(req.body.tipoServico === "impressao3d"){
        if(!(path.extname(sampleFile.name)==='.stl' || path.extname(sampleFile.name)==='.STL')) return {statusErroFile:true,msg:`No processo de impressão 3d você só pode enviar arquivos STL.`};
    }
    if(req.body.tipoServico === "impressaoPCB"){
        if(!(path.extname(sampleFile.name)==='.zip' || path.extname(sampleFile.name)==='.gbr' || path.extname(sampleFile.name)==='.ZIP' || path.extname(sampleFile.name)==='.GBR' )) return {statusErroFile:true,msg:`No processo de impressão de PCB's você só pode enviar arquivos gerber ou zip.`};
    }
    if(!(path.extname(sampleFile.name)==='.stl' || path.extname(sampleFile.name)==='.zip' || path.extname(sampleFile.name)==='.gbr' || path.extname(sampleFile.name)==='.STL' || path.extname(sampleFile.name)==='.ZIP' || path.extname(sampleFile.name)==='.GBR')){
        return {statusErroFile:true,msg:`Você não pode enviar arquivos com a extensão ${path.extname(sampleFile.name)}`};
    }
    return {statusErroFile:false,msg:`Envio de arquivo autorizado.`};
};
exports.getExt = (file) => {
    return path.extname(sampleFile.name);
}