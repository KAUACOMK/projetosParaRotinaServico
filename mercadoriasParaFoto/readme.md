## Um pouco sobre

# Feramenta que estou utilizando para melhorar antes um processo manual onde inseria os dados em uma tabela e manipulava manualmente agora consigo apenas ler o codigo de barras do produto e escolher entre os 2 estados que preciso.

# Mantenho um arquivo CSV como Db principal e quando tenho novos dados importado do ERP mesclo outro CSV ao meu principal.

# Foi feito dessa forma para contornar algumas limitações que tenho no computador da empresa!

## Formatos de dados

# Tabela do CSV Principal

CODIGO | NOME DO PRODUTO | DATA SEPARAÇÃO | DATA ENTREGA | DATA RETORNO | QUANT SEPARADO | QUANT ENTREGUE | STATUS | OBSERVAÇÃO | COD EAN

# Tabla do CSV para mesclagem

CODIGO | NOME DO PRODUTO | QUANT SEPARADO | COD EAN
