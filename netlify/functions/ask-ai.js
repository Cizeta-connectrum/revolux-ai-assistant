// このファイルは、正常に動作すれば「Hello from the function!」というメッセージを返します。
exports.handler = async function (event) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from the function!" }),
  };
};