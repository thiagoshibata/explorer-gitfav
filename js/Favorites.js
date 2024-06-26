import { GithubUser } from "./GithubUser.js"
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || []
  }

  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)
      if (userExists) {
        throw new Error("Usuário já cadastrado")
      }
      const user = await GithubUser.search(username)

      if (user.name === undefined) {
        throw new Error("Usuário não encontrado")
      }
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }
  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.onadd()
  }

  //method to check the button click and catch your value
  onadd() {
    const addButton = this.root.querySelector(".search button")
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input")

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    console.log(this.entries.lenth)

    if (this.entries.length === 0) {
      const rowNoUser = this.createRowNoUser()
      this.tbody.append(rowNoUser)
    } else {
      this.entries.forEach((user) => {
        const row = this.createRow()

        row.querySelector(
          ".user img"
        ).src = `https://github.com/${user.login}.png`
        row.querySelector(".user img").alt = `Imagem de ${user.name}`
        row.querySelector(".user a").href = `https://github.com/${user.login}`
        row.querySelector(".user p").textContent = user.name
        row.querySelector(".user span").textContent = "/" + user.login
        row.querySelector(".repositories").textContent = user.public_repos
        row.querySelector(".followers").textContent = user.followers
        row.querySelector(".remove").onclick = () => {
          const isOk = confirm("Tem certeza que deseja deletar este usuário?")
          if (isOk) {
            this.delete(user)
          }
        }

        this.tbody.append(row)
      })
    }
  }

  // method to create a text when there is no user favorite
  createRowNoUser() {
    const tr = document.createElement("tr")
    tr.classList.add("tr-no-user")

    tr.innerHTML = `
      <tr>
            <td colspan="4" rowspan="4">
              <div class="no-user">
                <img
                  src="/assets/big-star.svg"
                  alt="ícone de uma estrela com uma expressão de surpresa"
                />
                <span>Nenhum favorito ainda</span>
              </div>
            </td>
          </tr>
    `
    return tr
  }

  // methor to created view user row
  createRow() {
    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td class="user">
              <img
                src=""
                alt=""
              />
              <a href="" target="_blank">
                <p></p>
                <span></span>
              </a>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td>
              <button class="remove">Remover</button>
            </td>
    `

    return tr
  }

  //methor to remove All rows users
  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
