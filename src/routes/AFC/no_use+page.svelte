<!-- <head>
    <title>AFC Check</title>
</head>
    <table>
        <thead>
            <tr>
                <th>Block Number</th>
                <th>Transaction Hash</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
                <th>Timestamp</th>
            </tr>
        </thead>
        <tbody>
            {% for transaction in transactions %}
            <tr>
                <td>{{ transaction.blockNumber }}</td>
                <td>{{ transaction.hash }}</td>
                <td>{{ transaction.from }}</td>
                <td>{{ transaction.to }}</td>
                <td>{{ transaction.value }}</td>
                <td>{{ transaction.timestamp }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>

<script>
const apiUrl = 'https://api.arbiscan.io/api';
const userWalletAddress = '0x2834ede1c8389457b7812cfa61e2db151a57cf3f';

async function getAFCTransactions() {
  const response = await fetch(`${apiUrl}/transactions?address=${userWalletAddress}`);
  const data = await response.json();
  return data;
}

const transactions = await getAFCTransactions();
</script> -->
