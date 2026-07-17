CREATE TABLE usuario (
  usuario_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('administrador', 'financeiro'))
);

CREATE TABLE categorias(
  categoria_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE produtos (
  produto_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
   CHECK (LENGTH(TRIM(nome)) >= 3),
  marca VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  ativo BOOLEAN,
  quantidade INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  quantidade_min INT NOT NULL DEFAULT 5 CHECK (quantidade_min >= 0),
  
  categoria_id INT,
  FOREIGN KEY (categoria_id)
   REFERENCES categorias(categoria_id)
);


CREATE TABLE movimentacoes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    quantidade INT NOT NULL,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,

    
    FOREIGN KEY (produto_id)
     REFERENCES produtos(produto_id),
    
    
    FOREIGN KEY (usuario_id)
     REFERENCES usuario(usuario_id)
);