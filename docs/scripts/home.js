let allCommands = []

fetch('commands.json')
  .then(res => res.json())
  .then(data => {
    allCommands = data
    renderCommands(data)
  })

function renderCommands(commands) {
  const container = document.getElementById('commands')
  container.innerHTML = ''

  commands.forEach(cmd => {
    const div = document.createElement('div')
    div.className = 'card'

    div.innerHTML = `
  <div class="command-header">
    <div class="command-name">!${cmd.name}</div>
  </div>

  <div class="description">${cmd.description}</div>

  ${cmd.aliases.length ? `
    <div class="section">
      <strong>Outros nomes que você pode usar:</strong><br>
      <div class="aliases-container">
        ${cmd.aliases.map(a => `<span class="alias-tag">!${a}</span>`).join('')}
      </div>
    </div>
  ` : ''}

  ${cmd.arguments.length ? `
    <div class="section">
      <strong>Como usar os parâmetros:</strong>
      <table class="args-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Obrigatório</th>
            <th>Exemplo</th>
          </tr>
        </thead>
        <tbody>
          ${cmd.arguments.map(arg => `
            <tr>
              <td>${arg.name}</td>
              <td>${arg.required ? 'Sim' : 'Não'}</td>
              <td>
                ${arg.examples && arg.examples.length
                  ? arg.examples.map(ex => `<div class="arg-example">${ex}</div>`).join('')
                  : '-'
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  ${cmd.examples.length ? `
    <div class="section">
      <strong>Exemplos de uso:</strong>
      ${cmd.examples.map(ex => `<div class="example">${ex}</div>`).join('')}
    </div>
  ` : ''}
`;

    container.appendChild(div)
  })
}

document.getElementById('search').addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase()

  const filtered = allCommands.filter(cmd =>
    cmd.name.toLowerCase().includes(value) ||
    cmd.description.toLowerCase().includes(value) ||
    cmd.aliases.some(a => a.toLowerCase().includes(value))
  )

  renderCommands(filtered)
})

const toggle = document.getElementById('themeToggle')
const icon = document.getElementById('themeIcon')

const savedTheme = localStorage.getItem('theme')

if (savedTheme) {
  document.body.classList.toggle('dark', savedTheme === 'dark')
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark')
}

updateIcon();

toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark')

  const isDark = document.body.classList.contains('dark')

  localStorage.setItem('theme', isDark ? 'dark' : 'light')

  updateIcon();
});

function updateIcon() {
  const isDark = document.body.classList.contains('dark')

  icon.textContent = isDark ? '☀️' : '🌙'
}