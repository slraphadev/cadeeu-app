// Migrações do Drizzle embutidas como texto no bundle.
declare module '*.sql' {
  const conteudo: string;
  export default conteudo;
}
