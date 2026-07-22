// Importando módulos
import { Aluno } from './aluno';
import { StorageService } from './storage';

// Classe principal da aplicação
class AppCRUD {
    private alunos: Aluno[] = [];
    private storage: StorageService;
    private alunoEditando: number | null = null;

    constructor() {
        this.storage = new StorageService();
        this.carregarDados();
        this.inicializarEventos();
        this.renderizarLista();
    }

    // Carregar dados do LocalStorage
    private carregarDados(): void {
        this.alunos = this.storage.carregarAlunos();
    }

    // Salvar dados no LocalStorage
    private salvarDados(): void {
        this.storage.salvarAlunos(this.alunos);
    }

    // Inicializar eventos do formulário
    private inicializarEventos(): void {
        const formulario = document.getElementById('formulario') as HTMLFormElement;
        
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processarFormulario();
        });

        // Evento de pesquisa
        const campoBusca = document.getElementById('busca') as HTMLInputElement;
        campoBusca.addEventListener('input', () => {
            this.renderizarLista(campoBusca.value);
        });

        // Evento de ordenação
        const ordenacao = document.getElementById('ordenacao') as HTMLSelectElement;
        ordenacao.addEventListener('change', () => {
            this.renderizarLista();
        });
    }

    // Validação dos campos
    private validarCampos(nome: string, idade: string, email: string): boolean {
        // Validar nome
        if (nome.trim().length < 3) {
            alert('O nome deve ter pelo menos 3 caracteres!');
            return false;
        }

        // Validar idade
        const idadeNum = parseInt(idade);
        if (isNaN(idadeNum) || idadeNum < 1 || idadeNum > 120) {
            alert('Digite uma idade válida (entre 1 e 120)!');
            return false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Digite um email válido!');
            return false;
        }

        return true;
    }

    // Processar formulário (Create/Update)
    private processarFormulario(): void {
        const nome = (document.getElementById('nome') as HTMLInputElement).value.trim();
        const idade = (document.getElementById('idade') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();

        // Validação
        if (!this.validarCampos(nome, idade, email)) {
            return;
        }

        if (this.alunoEditando !== null) {
            // UPDATE - Atualizar aluno existente
            const indice = this.alunos.findIndex(a => a.id === this.alunoEditando);
            if (indice !== -1) {
                this.alunos[indice] = {
                    ...this.alunos[indice],
                    nome,
                    idade: parseInt(idade),
                    email
                };
            }
            this.alunoEditando = null;
            (document.querySelector('#formulario button[type="submit"]') as HTMLButtonElement).textContent = 'Cadastrar';
        } else {
            // CREATE - Criar novo aluno
            const novoAluno: Aluno = {
                id: Date.now(),
                nome,
                idade: parseInt(idade),
                email,
                dataCadastro: new Date().toISOString()
            };
            this.alunos.push(novoAluno);
        }

        // Salvar e atualizar
        this.salvarDados();
        this.renderizarLista();
        this.limparFormulario();
    }

    // Pesquisa por nome
    private filtrarAlunos(busca: string = ''): Aluno[] {
        let filtrados = [...this.alunos];

        if (busca.trim()) {
            filtrados = filtrados.filter(aluno => 
                aluno.nome.toLowerCase().includes(busca.toLowerCase())
            );
        }

        // Ordenação dos registros
        const ordenacao = (document.getElementById('ordenacao') as HTMLSelectElement).value;
        
        switch (ordenacao) {
            case 'nome-asc':
                filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'nome-desc':
                filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
            case 'idade-asc':
                filtrados.sort((a, b) => a.idade - b.idade);
                break;
            case 'idade-desc':
                filtrados.sort((a, b) => b.idade - a.idade);
                break;
            case 'data-asc':
                filtrados.sort((a, b) => new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime());
                break;
            case 'data-desc':
                filtrados.sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());
                break;
        }

        return filtrados;
    }

    // Renderizar lista na tela
    private renderizarLista(busca: string = ''): void {
        const listaDiv = document.getElementById('lista-alunos');
        if (!listaDiv) return;

        const alunosFiltrados = this.filtrarAlunos(busca);

        if (alunosFiltrados.length === 0) {
            listaDiv.innerHTML = '<p class="sem-registros">Nenhum aluno cadastrado.</p>';
            return;
        }

        listaDiv.innerHTML = '';
        
        alunosFiltrados.forEach((aluno, indice) => {
            const div = document.createElement('div');
            div.className = 'aluno-item';
            div.innerHTML = `
                <div class="aluno-info">
                    <strong>${indice + 1}. ${aluno.nome}</strong><br>
                    <span>🎂 ${aluno.idade} anos</span> | 
                    <span>📧 ${aluno.email}</span><br>
                    <small class="data-cadastro">Cadastrado em: ${new Date(aluno.dataCadastro).toLocaleDateString('pt-BR')}</small>
                </div>
                <div class="aluno-acoes">
                    <button class="btn-editar" onclick="app.editarAluno(${aluno.id})">️ Editar</button>
                    <button class="btn-excluir" onclick="app.excluirAluno(${aluno.id})">🗑️ Excluir</button>
                </div>
            `;
            listaDiv.appendChild(div);
        });

        // Atualizar contador
        const contador = document.getElementById('contador-alunos');
        if (contador) {
            contador.textContent = `Total: ${alunosFiltrados.length} aluno(s)`;
        }
    }

    // Editar aluno
    public editarAluno(id: number): void {
        const aluno = this.alunos.find(a => a.id === id);
        if (!aluno) return;

        (document.getElementById('nome') as HTMLInputElement).value = aluno.nome;
        (document.getElementById('idade') as HTMLInputElement).value = aluno.idade.toString();
        (document.getElementById('email') as HTMLInputElement).value = aluno.email;

        this.alunoEditando = id;
        (document.querySelector('#formulario button[type="submit"]') as HTMLButtonElement).textContent = 'Atualizar';
        
        document.getElementById('nome')?.focus();
    }

    // Excluir aluno
    public excluirAluno(id: number): void {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            this.alunos = this.alunos.filter(a => a.id !== id);
            this.salvarDados();
            this.renderizarLista();
            
            // Se estava editando o aluno excluído, limpar formulário
            if (this.alunoEditando === id) {
                this.limparFormulario();
            }
        }
    }

    // Limpar formulário
    private limparFormulario(): void {
        (document.getElementById('formulario') as HTMLFormElement).reset();
        this.alunoEditando = null;
        (document.querySelector('#formulario button[type="submit"]') as HTMLButtonElement).textContent = 'Cadastrar';
    }
}

// Tornar o 'app' global para o HTML conseguir clicar nos botões
declare global {
    interface Window { app: AppCRUD; }
}
window.app = new AppCRUD();