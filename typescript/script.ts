// ============================================
// INTERFACE (Bônus: tipagem)
// ============================================
interface Aluno {
    id: number;
    nome: string;
    idade: number;
    email: string;
}

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let alunos: Aluno[] = [];
let alunoEditandoId: number | null = null;

// Carregar dados ao iniciar
window.onload = function() {
    carregarDoLocalStorage();  // Bônus: LocalStorage
    renderizarLista();
    configurarEventos();
};

// ============================================
// BÔNUS: LOCALSTORAGE (Persistência)
// ============================================
function carregarDoLocalStorage(): void {
    const dados = localStorage.getItem('alunos_senai');
    if (dados) {
        alunos = JSON.parse(dados);
    }
}

function salvarNoLocalStorage(): void {
    localStorage.setItem('alunos_senai', JSON.stringify(alunos));
}

// ============================================
// CONFIGURAR EVENTOS
// ============================================
function configurarEventos(): void {
    const formulario = document.getElementById('formulario') as HTMLFormElement;
    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        salvarAluno();
    });

    // BÔNUS: Pesquisa por nome
    const busca = document.getElementById('busca') as HTMLInputElement;
    busca.addEventListener('input', function() {
        renderizarLista();
    });

    // BÔNUS: Ordenação
    const ordenacao = document.getElementById('ordenacao') as HTMLSelectElement;
    ordenacao.addEventListener('change', function() {
        renderizarLista();
    });
}

// ============================================
// BÔNUS: VALIDAÇÃO DOS CAMPOS
// ============================================
function validarCampos(nome: string, idade: string, email: string): boolean {
    // Validar nome (mínimo 3 caracteres)
    if (nome.trim().length < 3) {
        alert('O nome deve ter pelo menos 3 caracteres!');
        return false;
    }

    // Validar idade (1 a 120)
    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum) || idadeNum < 1 || idadeNum > 120) {
        alert('Digite uma idade válida (entre 1 e 120)!');
        return false;
    }

    // Validar email (deve ter @ e .)
    if (!email.includes('@') || !email.includes('.')) {
        alert('Digite um email válido!');
        return false;
    }

    return true;
}

// ============================================
// CREATE E UPDATE (Salvar)
// ============================================
function salvarAluno(): void {
    const nome = (document.getElementById('nome') as HTMLInputElement).value.trim();
    const idade = (document.getElementById('idade') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();

    // BÔNUS: Validação
    if (!validarCampos(nome, idade, email)) {
        return;
    }

    if (alunoEditandoId !== null) {
        // UPDATE: Atualizar aluno existente
        const indice = alunos.findIndex(a => a.id === alunoEditandoId);
        if (indice !== -1) {
            alunos[indice].nome = nome;
            alunos[indice].idade = parseInt(idade);
            alunos[indice].email = email;
        }
        alunoEditandoId = null;
        (document.getElementById('btn-salvar') as HTMLButtonElement).textContent = 'Cadastrar';
    } else {
        // CREATE: Criar novo aluno
        const novoAluno: Aluno = {
            id: Date.now(),
            nome: nome,
            idade: parseInt(idade),
            email: email
        };
        alunos.push(novoAluno);
    }

    // BÔNUS: Salvar no LocalStorage
    salvarNoLocalStorage();

    // Limpar formulário e atualizar lista
    (document.getElementById('formulario') as HTMLFormElement).reset();
    renderizarLista();
}

// ============================================
// READ (Listar com pesquisa e ordenação)
// ============================================
function renderizarLista(): void {
    const listaDiv = document.getElementById('lista-alunos');
    if (!listaDiv) return;

    // BÔNUS: Pesquisa por nome
    const busca = (document.getElementById('busca') as HTMLInputElement).value.toLowerCase();
    let alunosFiltrados = alunos.filter(aluno => 
        aluno.nome.toLowerCase().includes(busca)
    );

    // BÔNUS: Ordenação dos registros
    const ordenacao = (document.getElementById('ordenacao') as HTMLSelectElement).value;
    
    if (ordenacao === 'nome-asc') {
        alunosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordenacao === 'nome-desc') {
        alunosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
    } else if (ordenacao === 'idade-asc') {
        alunosFiltrados.sort((a, b) => a.idade - b.idade);
    } else if (ordenacao === 'idade-desc') {
        alunosFiltrados.sort((a, b) => b.idade - a.idade);
    }

    // Limpar lista
    listaDiv.innerHTML = '';

    // Mostrar mensagem se não tiver alunos
    if (alunosFiltrados.length === 0) {
        listaDiv.innerHTML = '<p class="sem-registros">Nenhum aluno encontrado.</p>';
        return;
    }

    // Criar elementos para cada aluno
    for (let i = 0; i < alunosFiltrados.length; i++) {
        const aluno = alunosFiltrados[i];
        
        const div = document.createElement('div');
        div.className = 'aluno-item';
        div.innerHTML = `
            <div class="aluno-info">
                <strong>${i + 1}. ${aluno.nome}</strong><br>
                <span>${aluno.idade} anos</span> | 
                <span>${aluno.email}</span>
            </div>
            <div class="aluno-botoes">
                <button class="btn-editar" onclick="editarAluno(${aluno.id})">Editar</button>
                <button class="btn-excluir" onclick="excluirAluno(${aluno.id})">Excluir</button>
            </div>
        `;
        listaDiv.appendChild(div);
    }

    // Atualizar contador
    const contador = document.getElementById('contador');
    if (contador) {
        contador.textContent = `Total: ${alunosFiltrados.length} aluno(s)`;
    }
}

// ============================================
// UPDATE (Editar)
// ============================================
function editarAluno(id: number): void {
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) return;

    (document.getElementById('nome') as HTMLInputElement).value = aluno.nome;
    (document.getElementById('idade') as HTMLInputElement).value = aluno.idade.toString();
    (document.getElementById('email') as HTMLInputElement).value = aluno.email;

    alunoEditandoId = id;
    (document.getElementById('btn-salvar') as HTMLButtonElement).textContent = 'Atualizar';
    
    document.getElementById('nome')?.focus();
}

// ============================================
// DELETE (Excluir)
// ============================================
function excluirAluno(id: number): void {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        alunos = alunos.filter(a => a.id !== id);
        
        // BÔNUS: Salvar no LocalStorage
        salvarNoLocalStorage();
        
        renderizarLista();

        // Se estava editando o aluno excluído, limpar
        if (alunoEditandoId === id) {
            (document.getElementById('formulario') as HTMLFormElement).reset();
            alunoEditandoId = null;
            (document.getElementById('btn-salvar') as HTMLButtonElement).textContent = 'Cadastrar';
        }
    }
}