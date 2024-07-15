Weather App

Descrição

O Weather App é uma aplicação web que permite aos usuários consultar previsões meteorológicas para cidades do Brasil e domundo. A aplicação utiliza a biblioteca OpenLayers para exibir um mapa interativo e duas APIs para obter dados de previsão do tempo e geocodificação.

Funcionalidades
- Consulta de previsão do tempo para cidades do Brasil.
- Exibição de informações meteorológicas detalhadas, incluindo temperatura atual, máxima, mínima, tipo do clima, probabilidade de chuva e fase da Lua.
- Previsões para os próximos 3 dias.
- Armazenamento e acesso rápido a consultas anteriores.
- Mapa interativo usando a biblioteca OpenLayers.

Tecnologias Utilizadas
- HTML: Estrutura da aplicação.
- CSS: Estilização da aplicação.
- JavaScript: Lógica da aplicação.
- OpenLayers: Biblioteca para exibição de mapas interativos.
 - APIs:
  - OpenWeatherMap: Geocodificação.
  - HG Weather: Previsão do tempo.

Instalação
 Pré-requisitos
  - Node.js e npm instalados.
  - Conta no OpenWeatherMap para obter uma chave de API.
  - Conta no HG Weather para obter uma chave de API.

Passos
1. Clone o repositório:
git clone https://github.com/samukaa07/weather-app.git

2. Navegue até o diretório do projeto:
cd weather-app

3. Instale as dependências:
npm install

4. Configure as chaves de API. Crie um arquivo .env na raiz do projeto e adicione suas chaves de API:
OPENWEATHER_API_KEY=your_openweather_api_key
HGWEATHER_API_KEY=your_hgweather_api_key

5. Inicie o servidor:
npm start
Abra o navegador e acesse http://localhost:3000.

Como Usar
1. Pesquisar Cidade: Digite o nome da cidade no campo de pesquisa e clique em "Consultar".
2. Visualizar Previsão: A previsão do tempo para a cidade será exibida, incluindo detalhes como temperatura atual, máxima, mínima, tipo do clima, probabilidade de chuva e fase da Lua.
3. Visualizar Mapa: O mapa se moverá para a localização da cidade pesquisada.
4. Cidades Consultadas: As cidades consultadas anteriormente ficarão disponíveis para acesso rápido no seletor de cidades cacheadas.

Exemplos de Uso
  Pesquisa de Cidade
1. Digite o nome da cidade na barra de pesquisa.
2. Clique no botão "Consultar".
3. A previsão do tempo será exibida junto com o mapa atualizado para a localização da cidade.
  Acesso a Cidades Cacheadas
1. Após consultar uma cidade, ela será armazenada no seletor de cidades cacheadas.
2. Selecione a cidade no seletor para visualizar rapidamente as informações da última consulta.
  
