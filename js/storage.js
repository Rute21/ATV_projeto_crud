export class StorageService {
    constructor() {
        this.chaveStorage = 'crud_alunos_senai';
    }
    // Salvar dados no LocalStorage
    salvarAlunos(alunos) {
        localStorage.setItem(this.chaveStorage, JSON.stringify(alunos));
    }
    // Carregar dados do LocalStorage
    carregarAlunos() {
        const dados = localStorage.getItem(this.chaveStorage);
        return dados ? JSON.parse(dados) : [];
    }
    // Limpar todos os dados
    limpar() {
        localStorage.removeItem(this.chaveStorage);
    }
}
