var template;
var dismiss;

window.onload = function () {
    template = generateTemplate("#t2");
}

function gerar() {
    var dados = {
        nome: nome.value || "[Digite Nome]",
        departamento: departamento.value || "[Digite departamento]",
        email: email.value || "[Digite Email]",
        tel: tel.value || "[Celular]",
        endereco: endereco.value || "[endereço]",
    };

    assinatura.innerHTML = template.apply(dados);

    createSelection(assinatura);

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';

        alerttext.innerHTML = ('Assinatura <b>copiada</b> com sucesso!');
        alertdiv.classList.add("alert-success");
        alertdiv.classList.remove("hidden");
    } catch (err) {
        alerttext.innerHTML = ('Aperte <code>CTRL+C</code> para copiar');
        alertdiv.classList.add("alert-info");
        alertdiv.classList.remove("hidden");
    }
	
    if(dismiss) clearTimeout(dismiss);
    dismiss = setTimeout(function() {
        alertdiv.classList.add("hidden");
    }, 15000);
}

function createSelection(element) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.setStartBefore(element.firstChild);
    range.setEndAfter(element.lastChild);
    selection.removeAllRanges();
    selection.addRange(range);
}


var compileTemplate = function (html) {
    var re = /{{([^}]*(?:}[^}]+)*}*)}}/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;

    var add = function (line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') : (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';

    var template = new Function(code.replace(/[\r\t\n]/g, ''));
    return template;
}

    function generateTemplate(selector) {
        var el = document.querySelector(selector);
        if (el.type.toLowerCase() == "template/html") {
            return compileTemplate(el.innerHTML);
        } else throw Error("Type of '" + selector + "' is not a template/html");
    }
