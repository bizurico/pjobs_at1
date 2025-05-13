document.addEventListener("DOMContentLoaded", function() {
    carregarServicos();
  
    // Adicionar serviço
    const form = document.getElementById('form-servico');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const titulo = document.getElementById('titulo').value;
      const descricao = document.getElementById('descricao').value;
      const prestador = document.getElementById('prestador').value;
      const cliente = document.getElementById('cliente').value;
  
      const novoServico = {
        titulo: titulo,
        descricao: descricao,
        prestador: prestador,
        cliente: cliente
      };
  
      // Enviar para o servidor
      fetch('http://localhost:5000/servicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoServico)
      })
      .then(response => response.json())
      .then(() => {
        carregarServicos();  // Recarregar a lista após adicionar
      })
      .catch(error => {
        console.error('Erro ao adicionar serviço:', error);
      });
    });
  });
  
  function carregarServicos() {
    fetch('http://localhost:5000/servicos')
      .then(res => res.json())
      .then(dados => {
        const lista = document.getElementById('lista-servicos');
        if (!lista) {
          console.error('Elemento #lista-servicos não encontrado');
          return;
        }
  
        lista.innerHTML = '';  // Limpa a lista antes de adicionar novos itens
  
        dados.forEach(servico => {
          // Cria um item de lista para cada serviço
          const item = document.createElement('li');
          item.innerHTML = 
            `Título: ${servico.titulo} | 
             Prestador: ${servico.prestador} | 
             Cliente: ${servico.cliente} | 
             Descrição: ${servico.descricao}`;
  
          // Cria o botão de excluir
          const botaoExcluir = document.createElement('button');
          botaoExcluir.textContent = 'Excluir';
          botaoExcluir.addEventListener('click', () => excluirServico(servico.id));  // Passa o id para excluir
  
          // Adiciona o botão de excluir ao item de lista
          item.appendChild(botaoExcluir);
  
          // Adiciona o item (com botão de excluir) à lista
          lista.appendChild(item);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar serviços:', error);
      });
  }
  
  function excluirServico(id) {
    fetch(`http://localhost:5000/servicos/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
      carregarServicos();  // Recarrega os serviços para refletir a exclusão
    })
    .catch(error => {
      console.error('Erro ao excluir serviço:', error);
    });
  }
  
  function buscarServicoPorId() {
  const id = document.getElementById('buscar-id').value;
  if (!id) return;

  fetch(`http://localhost:5000/servicos/${id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Serviço não encontrado");
      }
      return res.json();
    })
    .then(servico => {
      const div = document.getElementById('servico-buscado');
      div.innerHTML = `
        <h3>Serviço Encontrado:</h3>
        <p><strong>Título:</strong> ${servico.titulo}</p>
        <p><strong>Descrição:</strong> ${servico.descricao}</p>
        <p><strong>Prestador:</strong> ${servico.prestador}</p>
        <p><strong>Cliente:</strong> ${servico.cliente}</p>
      `;
    })
    .catch(err => {
      document.getElementById('servico-buscado').innerHTML = `<p style="color: red;">${err.message}</p>`;
    });
}
