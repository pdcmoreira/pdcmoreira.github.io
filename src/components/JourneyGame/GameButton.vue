<template>
  <button class="game-button">
    <slot />
  </button>
</template>

<style lang="less">
.game-button {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 3;
  position: relative;
  display: inline-block;
  padding: 6px 8px;
  margin: 4px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #212529;
  background-color: #fff;

  &::after {
    position: absolute;
    top: -4px;
    right: -4px;
    bottom: -4px;
    left: -4px;
    content: '';
    box-shadow: inset -4px -4px #adafbc;
  }

  &:hover {
    color: #212529;
    text-decoration: none;
    background-color: #e7e7e7;

    &::after {
      box-shadow: inset -6px -6px #adafbc;
    }
  }

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 6px rgba(173, 175, 188, 0.3);
  }

  &:active::after {
    box-shadow: inset 4px 4px #adafbc;
  }
}
</style>
