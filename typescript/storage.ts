// Módulo para persistência de dados
import { Aluno } from './aluno';

export class StorageService {
    private chaveStorage = 'crud_alunos_senai';

    // Salvar dados no LocalStorage
    salvarAlunos(alunos: Aluno[]): void {
        localStorage.setItem(this.chaveStorage, JSON.stringify(alunos));
    }

    // Carregar dados do LocalStorage
    carregarAlunos(): Aluno[] {
        const dados = localStorage.getItem(this.chaveStorage);
        return dados ? JSON.parse(dados) : [];
    }

    // Limpar todos os dados
    limpar(): void {
        localStorage.removeItem(this.chaveStorage);
    }
}