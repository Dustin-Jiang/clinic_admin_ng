<template>
  <div style="display: flex;">
    <div style="flex-shrink: 0;"><slot name="left"></slot></div>
    <div style="width: 100vw; flex-shrink: 1;"></div>
    <div style="flex-shrink: 0;"><slot name="right"></slot></div>
  </div>
</template>