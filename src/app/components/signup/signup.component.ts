import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignupService } from '../../services/signup.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

interface Categoria {
    id: number;
    nome: string;
}

@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    imports: [FormsModule, CommonModule, RouterModule],
    providers: [SignupService]
})
export class SignupComponent {
    signupData = {
        username: '',
        email: '',
        telefone: '',  // Adicionando o campo telefone
        password: '',
        confirmPassword: '',
        categoriaId: null as number | null
    };

    categorias: Categoria[] = [
        { id: 1, nome: 'Vendas' },
        { id: 2, nome: 'Gerencial' },
        { id: 3, nome: 'Cozinha' }
    ];

    isModalOpen: boolean = false;
    message: string = '';  // Propriedade para armazenar a mensagem de feedback

    constructor(private signupService: SignupService, private router: Router) {}

    onSubmit(): void {
        // Cria o objeto de requisição com categoria_id e telefone
        const requestData = {
            nomeUsuario: this.signupData.username,
            email: this.signupData.email,
            telefone: this.signupData.telefone,  // Inclui o telefone
            senha: this.signupData.password,
            categoria_id: this.signupData.categoriaId
        };

        // Enviando a requisição de registro
        this.signupService.register(requestData).subscribe({
            next: (response: any) => {
                // A lógica aqui será executada para qualquer resposta, independentemente do status
                // Limpa os campos do formulário
                this.resetForm();

                // Mostra mensagem de sucesso
                this.isModalOpen = true;
                this.message = 'Dados enviados, aguardando liberação.';
            },
            error: (error: HttpErrorResponse) => {
                console.error('Erro ao registrar usuário:', error);

                // A lógica aqui será executada se ocorrer um erro no envio ou na resposta
                this.isModalOpen = true;
                this.message = 'Erro ao enviar dados. Tente novamente.';
            }
        });
    }

    closeModal() {
        this.isModalOpen = false;
        this.router.navigate(['/login']);
    }

    resetForm(): void {
        this.signupData = {
            username: '',
            email: '',
            telefone: '',  // Reseta o telefone
            password: '',
            confirmPassword: '',
            categoriaId: null
        };
    }

    navigateToLogin(): void {
        this.router.navigate(['/login']);
    }
}
