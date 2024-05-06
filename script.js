async function main(){
  const res = await fetch("https://api.takasumibot.com/v1/trade")
    .then(res=>res.json())
    .catch(err=>console.log(`Fetch Error: ${err}`));

  console.log(res);

  const time = res.data.map(data=>formatDate(new Date(data.time),"MM月dd日HH時mm分"));
  const price = res.data.map(data=>data.price);
  const buy = res.data.map(data=>Number(data.buy));
  const sell = res.data.map(data=>-Number(data.sell));

  new Chart(document.getElementById("stock"),{
      data: {
      labels: time,
      datasets: [
        {
          type: "line",
          label: "株価",
          data: price,
          backgroundColor: "rgba(0,0,0)",
          borderColor: "rgba(0,0,0)",
          borderWidth: 1,
          radius: 0,
          yAxisID: "left"
        },
        {
          type: "bar",
          label: "買った回数",
          data: buy,
          backgroundColor: "rgba(0,0,255,0.5)",
          borderColor: "rgba(0,0,255,0.5)",
          borderWidth: 1,
          radius: 0,
          yAxisID: "right"
        },
        {
          type: "bar",
          label: "売った回数",
          data: sell,
          backgroundColor: "rgba(255,0,0,0.5)",
          borderColor: "rgba(255,0,0,0.5)",
          borderWidth: 1,
          radius: 0,
          yAxisID: "right"
        },
      ]
    },
    options: {
      interaction: {
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: "株価・売買回数",
          font: {
            size: 20
          }
        },
        legend: true
      },
      responsive: true,
      scales: {
        left: {
          position: "left",
          type: "linear",
          max: Math.max(...price)+50,
          min: Math.min(...price)-50,
          ticks: {
            stepSize: 10,
            callback:(value)=>{
              return `${value}コイン`;
            }
          }
        },
        right:{
          position: "right",
          type: "linear",
          max: Math.max(...(Math.max(...buy) > Math.max(...sell) ? buy : sell))+10,
          min: Math.min(...(Math.min(...buy) < Math.min(...sell) ? buy : sell))-10,
          ticks: {
            stepSize: 1,
            callback: (value)=>{
              return `${Math.abs(Number(value))}回`;
            }
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
}

main();

function formatDate(date,format){
  return format
    .replace(/yyyy/g,date.getFullYear())
    .replace(/MM/g,((date.getMonth()+1)))
    .replace(/dd/g,(date.getDate()))
    .replace(/HH/g,(date.getHours()))
    .replace(/mm/g,(date.getMinutes()));
};