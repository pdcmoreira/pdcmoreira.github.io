<template>
  <div class="contact-info">
    <div class="avatar">
      <img src="https://avatars.githubusercontent.com/u/4430606?v=4" alt="Author's picture" />
    </div>

    <div class="badges">
      <a href="https://github.com/pdcmoreira/" target="_blank">
        <img
          src="https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=fff"
          alt="GitHub"
        />
      </a>

      <a href="https://www.linkedin.com/in/pdcmoreira/" target="_blank">
        <img
          src="https://img.shields.io/badge/-LinkedIn-0a66c2?logo=Linkedin&logoColor=fff"
          alt="LinkedIn"
        />
      </a>

      <a href="https://www.instagram.com/pdcmoreira/" target="_blank">
        <img
          src="https://img.shields.io/badge/-Instagram-e4405f?logo=instagram&logoColor=fff"
          alt="Instagram"
        />
      </a>

      <a href="mailto:pdcmoreira@gmail.com" target="_blank">
        <img
          src="https://img.shields.io/badge/-Gmail-ea4335?logo=Gmail&logoColor=fff"
          alt="Gmail"
        />
      </a>
    </div>
  </div>
</template>

<style lang="less">
.contact-info {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 4px;
  border-radius: 4px;

  & > .avatar {
    & > img {
      height: 26px;
      border-radius: 100%;
      margin: 0 4px;
    }
  }

  & > .badges {
    display: flex;

    & > a {
      margin: 0 4px;
    }
  }
}
</style>
