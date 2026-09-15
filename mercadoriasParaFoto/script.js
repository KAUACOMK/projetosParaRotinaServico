let bancoDeDados = [];
let dadosParaMesclar = [];
let bancoDeDadosMesclado = [];

//Evento para ler o arquivo CSV Banco Principal e atualizar a tabela
document.getElementById("arquivoCsv").addEventListener("change", function (e) {
  let leitorCsv = new FileReader();

  leitorCsv.onload = function (evento) {
    let linhas = evento.target.result.split("\n");
    bancoDeDados = [];
    for (let i = 1; i < linhas.length; i++) {
      if (linhas[i].trim() === "") continue;

      // pode ser , ou ;.
      let colunas = linhas[i].split(";");

      //Pegando o Obj
      bancoDeDados.push({
        codigo: colunas[0].trim(),
        nome: colunas[1].trim(),
        dataSeparacao: colunas[2].trim(),
        dataEntrega: colunas[3].trim(),
        dataRetorno: colunas[4].trim(),
        quantSeparado: colunas[5].trim(),
        quantEntregue: colunas[6].trim(),
        status: colunas[7].trim(),
        observacao: colunas[8].trim(),
        ean: colunas[9].trim(),
      });
    }
    atualizarTabela();
  };
  leitorCsv.readAsText(e.target.files[0]);
});

//Evento para ler o arquivo CSV Que será mesclado e atualizar a tabela
document
  .getElementById("csvParaMesclar")
  .addEventListener("change", function (e) {
    let leitorCsv = new FileReader();

    leitorCsv.onload = function (evento) {
      let linhas = evento.target.result.split("\n");
      dadosParaMesclar = [];
      for (let i = 1; i < linhas.length; i++) {
        if (linhas[i].trim() === "") continue;

        // pode ser , ou ;.
        let colunas = linhas[i].split(";");
        //Pegando o Obj
        dadosParaMesclar.push({
          codigo: colunas[0].trim(),
          nome: colunas[1].trim(),
          quantSeparado: colunas[2].trim(),
          ean: colunas[3].trim(),
        });
      }
      mesclarCSV(dadosParaMesclar);
    };
    leitorCsv.readAsText(e.target.files[0]);
    atualizarTabela();
  });

//Evento para ler o código de barras e atualizar o status do produto
document.getElementById("leitor").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    let estadoSwitch = document.getElementById("switch-shadow");
    let codigoLido = this.value.trim();
    let produto = bancoDeDados.find((p) => p.ean === codigoLido);
    let mensagem = document.getElementById("mensagem");

    if (!estadoSwitch.checked && produto) {
      simularProduto(produto);
      mensagem.textContent = "";
      alert("Produto simulado com sucesso!");
    } else if (estadoSwitch.checked && produto) {
      retornarProduto(produto);
      mensagem.textContent = "";
      alert("Produto retornado com sucesso!");
    } else {
      mensagem.textContent = "❌ Produto não encontrado na lista!";
    }
    this.value = "";
  }
});

function atualizarTabela() {
  let tbody = document.querySelector("#tabelaDados tbody");
  tbody.innerHTML = "";

  bancoDeDados.forEach((produto) => {
    let tr = document.createElement("tr");

    if (produto.status === "Separado") tr.className = "separado";
    if (produto.status === "Entregue") tr.className = "entregue";
    if (produto.status === "Retornou") tr.className = "retornou";
    if (produto.status === "Simulado") tr.className = "simulado";

    tr.innerHTML = `
    <td>${produto.codigo}</td>
    <td>${produto.nome}</td>
    <td>${produto.dataSeparacao || ""}</td>
    <td>${produto.dataEntrega || ""}</td>
    <td>${produto.dataRetorno}</td>
    <td>${produto.quantSeparado || ""}</td>
    <td>${produto.quantEntregue || ""}</td>
    <td>${produto.status}</td>
    <td>${produto.observacao || ""}</td>
    <td>${produto.ean}</td>
                `;
    tbody.appendChild(tr);
  });
}

function normalizarDados(dadosParaMesclar) {
  let dataTime = new DateTime().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  let dadosParaMesclarNormalizados = dadosParaMesclar.map((p) => ({
    ...p,
    codigo: p.codigo.trim(),
    nome: p.nome.trim(),
    dataSeparacao: dateTime,
    dataEntrega: "",
    dataRetorno: "",
    quantSeparado: p.quantSeparado.trim(),
    quantEntregue: "0",
    status: "Separado",
    observacao: "",
    ean: p.ean.trim(),
  }));
  return dadosParaMesclarNormalizados;
}

function mesclarCSV(dadosParaMesclar) {
  if (dadosParaMesclar.length === 0) {
    alert("Não há dados para mesclar!");
    return;
  }
  let dadosNormalizados = normalizarDados(dadosParaMesclar);
  bancoDeDados.push(...dadosNormalizados);
  atualizarTabela();
}

function exportarCSV() {
  if (bancoDeDados.length === 0) {
    alert("Não há dados para exportar!");
    return;
  }
  let conteudoCsv =
    "CODIGO;NOME;DATA SEPARAÇÃO;DATA ENTREGA;DATA RETORNO;QUANT SEPARADO;QUANT ENTREGUE;STATUS;OBSERVAÇÃO;COD EAN\n";

  bancoDeDados.forEach((p) => {
    conteudoCsv += `${p.codigo};${p.nome};${p.dataSeparacao};${p.dataEntrega || "Não Informado"};${p.dataRetorno};${p.quantSeparado};${p.quantEntregue || "Não Informado"};${p.status};${p.observacao || "Sem observação"};${p.ean}\n`;
  });

  let blob = new Blob([conteudoCsv], { type: "text/csv;charset=utf-8;" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "BaseDeDadosAtualizado.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function entregarProdutos() {
  bancoDeDados.forEach((p) => {
    if (p.status === "Separado") {
      p.status = "Entregue";
      p.dataEntrega =
        new Date().toLocaleDateString("pt-BR") +
        " " +
        new Date().toLocaleTimeString("pt-BR");
    }
  });
  atualizarTabela();
}

function adicionarObservacao(codigo, observacao) {
  let produto = bancoDeDados.find((p) => p.ean === codigo);
  if (produto) {
    produto.observacao = observacao;
    atualizarTabela();
  } else {
    alert("Produto não encontrado para adicionar observação!");
  }
}

function simularProduto(produto) {
  if (produto.status === "Simulado") {
    alert("Produto já foi simulado!");
    return;
  }
  produto.status = "Simulado";
  produto.dataRetorno =
    new Date().toLocaleDateString("pt-BR") +
    " " +
    new Date().toLocaleTimeString("pt-BR");
  atualizarTabela();
}

function retornarProduto(produto) {
  if (produto.status === "Retornou") {
    alert("Produto já foi retornado!");
    return;
  }
  produto.status = "Retornou";
  produto.dataRetorno =
    new Date().toLocaleDateString("pt-BR") +
    " " +
    new Date().toLocaleTimeString("pt-BR");
  atualizarTabela();
}
