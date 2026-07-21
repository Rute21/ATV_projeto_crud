"use strict";
// ARRAY PARA GUARDAR OS ALUNOS
let alunos = [];
// PEGAR ELEMENTOS DO HTML
const formulario = document.querySelector("#formulario");
const listaAlunos = document.querySelector("#lista-alunos");
// QUANDO CLICAR EM SALVAR
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Impede o formulário de recarregar a página
    // PEGAR OS DADOS DO FORMULÁRIO
    const nome = document.querySelector("#nome").value;
    const idade = document.querySelector("#idade").value;
    const email = document.querySelector("#email").value;
    // CRIAR OBJETO COM OS DADOS
    const aluno = {
        nome: nome,
        idade: idade,
        email: email
    };
    // ADICIONAR NO ARRAY
    alunos.push(aluno);
    // LIMPAR FORMULÁRIO
    formulario.reset();
    // ATUALIZAR A LISTA NA TELA
    mostrarAlunos();
});
// FUNÇÃO PARA MOSTRAR OS ALUNOS NA TELA
function mostrarAlunos() {
    // LIMPAR A LISTA ANTES DE ATUALIZAR
    listaAlunos.innerHTML = "";
    // SE NÃO TIVER NENHUM ALUNO
    if (alunos.length === 0) {
        listaAlunos.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
        return;
    }
    // PERCORRER O ARRAY E MOSTRAR CADA ALUNO
    for (let i = 0; i < alunos.length; i++) {
        const aluno = alunos[i];
        // CRIAR UM ELEMENTO HTML PARA CADA ALUNO
        const divAluno = document.createElement("div");
        divAluno.className = "aluno-item";
        divAluno.innerHTML = `
            <strong>${i + 1}. ${aluno.nome}</strong> - ${aluno.idade} anos - ${aluno.email}
            <button onclick="editarAluno(${i})">Editar</button>
            <button onclick="excluirAluno(${i})">Excluir</button>
        `;
        listaAlunos.appendChild(divAluno);
    }
}
// FUNÇÃO PARA EDITAR UM ALUNO
function editarAluno(indice) {
    const aluno = alunos[indice];
    // COLOCAR OS DADOS NO FORMULÁRIO
    document.querySelector("#nome").value = aluno.nome;
    document.querySelector("#idade").value = aluno.idade;
    document.querySelector("#email").value = aluno.email;
    // REMOVER O ALUNO ANTIGO (VAI SER ADICIONADO DE NOVO QUANDO SALVAR)
    alunos.splice(indice, 1);
}
// FUNÇÃO PARA EXCLUIR UM ALUNO
function excluirAluno(indice) {
    const confirmar = confirm("Tem certeza que deseja excluir?");
    if (confirmar) {
        // REMOVER DO ARRAY
        alunos.splice(indice, 1);
        // ATUALIZAR A TELA
        mostrarAlunos();
    }
}
// MOSTRAR LISTA VAZIA QUANDO CARREGAR A PÁGINA
mostrarAlunos();
