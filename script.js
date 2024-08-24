document.addEventListener('DOMContentLoaded', async function () {
    let provider;
    let signer;
    let contract;
  
    const contractAddress = '0xcf0a4f43daae1fde84722469a01ba24536bec84f';
    const contractABI = [
      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'getLatestPrice',
        outputs: [
          {
            internalType: 'int256',
            name: '',
            type: 'int256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getTimeStamp',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];
  
    async function connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          signer = provider.getSigner();
          const address = await signer.getAddress();
          document.getElementById(
            'accountAddress'
          ).textContent = `Conectado: ${address}`;
          contract = new ethers.Contract(contractAddress, contractABI, signer);
          console.log('Contrato inicializado correctamente');
        } catch (error) {
          console.error('Error al conectar MetaMask:', error);
          document.getElementById('accountAddress').textContent =
            'Error al conectar MetaMask';
        }
      } else {
        alert('MetaMask no está instalado!');
      }
    }
  
    function formatPrice(price) {
      const formattedPrice = (price / 1e8).toFixed(2); // Ajustar la escala de precios (suponiendo que el precio esté en formato de 8 decimales)
      return `$${formattedPrice} USD`;
    }
  
    document
      .getElementById('connectButton')
      .addEventListener('click', async () => {
        await connectWallet();
      });
  
    document
      .getElementById('getPriceButton')
      .addEventListener('click', async () => {
        if (contract) {
          try {
            const price = await contract.getLatestPrice();
            const formattedPrice = formatPrice(price);
            document.getElementById(
              'priceResult'
            ).textContent = `Último Precio ETH/USD: ${formattedPrice}`;
          } catch (error) {
            console.error('Error al obtener el precio:', error);
            document.getElementById(
              'priceResult'
            ).textContent = `Error: ${error.message}`;
          }
        } else {
          alert('Conecta MetaMask primero.');
        }
      });
  
    document
      .getElementById('getTimeButton')
      .addEventListener('click', async () => {
        if (contract) {
          try {
            const timestamp = await contract.getTimeStamp();
            const date = new Date(timestamp.toNumber() * 1000);
            document.getElementById(
              'timeResult'
            ).textContent = `Timestamp: ${date.toLocaleString()}`;
          } catch (error) {
            console.error('Error al obtener el timestamp:', error);
            document.getElementById(
              'timeResult'
            ).textContent = `Error: ${error.message}`;
          }
        } else {
          alert('Conecta MetaMask primero.');
        }
      });
  });
  