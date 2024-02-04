const formatardata = (dataa) => {
    data = new Date(dataa)
    return data.toLocaleDateString('pt-BR', {timeZone: 'UTC'})
}

const abrirformulario = () => {
    document.getElementById('tabela').classList.add('d-none')
    document.getElementById('formulario').classList.remove('d-none')
}

const fecharFormulario = () => {
    atualizarTabela()
    document.getElementById('tabela').classList.remove('d-none')
    document.getElementById('formulario').classList.add('d-none')
    limparFormulario()
}

const limparFormulario = () => {
    document.getElementById('data_atendimento').value = ""
    document.getElementById('descricao').value = ""
    document.getElementById('data').dataset.index = 'new'
}

const deletarDados = () => {
    const response = confirm(`Deseja realmente excluir toda a tabela?`)
    if (response) {
        localStorage.setItem('db_cliente', JSON.stringify([]))
        atualizarTabela()
    }
}

const lerCliente = () => JSON.parse(localStorage.getItem('db_cliente')) ?? []
const setArmazenamentoLocal = (dbcliente) => localStorage.setItem("db_cliente", JSON.stringify(dbcliente))

const criar = (cliente) => {
    const dbcliente = lerCliente()
    dbcliente.push(cliente)
    setArmazenamentoLocal(dbcliente)
}

const limpaTabela = () => {
    const rows = document.querySelectorAll('#tabela>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const atualizarTabela = () => {
    const dbcliente = lerCliente()
    limpaTabela()
    // dbcliente.sort((a, b) => new Date(a.data_atendimento) - new Date(b.data_atendimento))
    dbcliente.forEach(criarLinha)
}

const criarLinha = (cliente, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td class="text-center">
    <button type="button" class="btn btn-warning text-dark btn-sm " id="edit-${index}">
        Alterar<i type="button" class="fa fa-fw fa-1x py-1 fa-pencil-square-o"></i>
        
    </button>
</td>
    <td class=" text-light">${formatardata(cliente.data_atendimento)}</td>
    <td class=" text-light">${cliente.descricao}</td>
   
    <td class="text-center">
        <button type="button" class="btn btn-danger  text-dark btn-sm " id="delete-${index}">
           Deletar<i  type="button"class="fa fa-fw fa-1x py-1 fa-trash"></i>
            
        </button>
    </td>
    `
    document.querySelector('#tabela>tbody').appendChild(newRow)
}

const isValidFields = () => document.getElementById('form').reportValidity()

const atualizar = (index, cliente) => {
    const dbcliente = lerCliente()
    dbcliente[index] = cliente
    salvarClientesOrdenados(dbcliente)
}

const salvarClientesOrdenados = (clientes) => {
    // Ordenar os clientes com base na data de atendimento
    clientes.sort((a, b) => new Date(a.data_atendimento) - new Date(b.data_atendimento))

    // Salvar os clientes ordenados no armazenamento local
    setArmazenamentoLocal(clientes)
}

const salvarFormulario = () => {
    if (isValidFields()) {
        const cliente = {
            data_atendimento: document.getElementById('data_atendimento').value,
            descricao: document.getElementById('descricao').value,
        }
        const index = document.getElementById('data_atendimento').dataset.index
        console.log(index);
        if (index == 'new') {
            criar(cliente)
            atualizarTabela()
            fecharFormulario()
        } else {
            atualizar(index, cliente)
            atualizarTabela()
            fecharFormulario()
        }
    }
}

const setDadosFormulario = (cliente) => {
    document.getElementById('data_atendimento').value = cliente.data_atendimento
    document.getElementById('descricao').value = cliente.descricao
    document.getElementById('data_atendimento').dataset.index = cliente.index
}

const editarCliente = (index) => {
    const cliente = lerCliente()[index]
    cliente.index = index
    setDadosFormulario(cliente)
    abrirformulario()
}

const deletarCliente = (index) => {
    const dbcliente = lerCliente()
    dbcliente.splice(index, 1)
    setArmazenamentoLocal(dbcliente)
}

const editarDeletar = (event) => {
    if (event.target.type = 'button') {
        console.log(event.target);
        const [action, index] = event.target.id.split('-')
        if (action == 'edit') {
            editarCliente(index)
        } else if (action == 'delete') {
            const response = confirm(`Deseja realmente excluir o cliente?`)
            if (response) {
                deletarCliente(index)
                atualizarTabela()
            }
        }
    }
}

document.getElementById('adicionar')
    .addEventListener('click', abrirformulario)

document.getElementById('cancelar')
    .addEventListener('click', fecharFormulario)

document.getElementById('salvar')
    .addEventListener('click', salvarFormulario)

document.querySelector('#tabela>tbody').addEventListener('click', editarDeletar)

document.getElementById('zerar')
    .addEventListener('click', deletarDados)

atualizarTabela()

document.getElementById('datahoje').innerHTML = formatardata(new Date());
