[//]: # (title: RSAキーの生成)

<show-structure for="chapter" depth="2"/>

<var name="example_name" value="auth-jwt-rs256"/>

<tldr>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[RSA (Rivest–Shamir–Adleman)](https://en.wikipedia.org/wiki/RSA_(cryptosystem))は、安全なデータ送信、デジタル署名、鍵交換を可能にする広く使用されている公開鍵暗号システムです。

RSA暗号アルゴリズムの一部であるRS256は、ハッシュ化にSHA-256を利用し、鍵（通常は2048ビット、4096ビット以上）を使用してデジタル通信を安全にします。

[JSON Web Token (JWT)](https://jwt.io/)認証の分野では、RS256は重要な役割を果たします。なぜなら、公開鍵/秘密鍵のペアが使用されるRS256などの署名メカニズムを通じて、JWTの整合性と信頼性を検証できるからです。これにより、トークンに含まれる情報が改ざん防止され、信頼できるものとして維持されます。

このセクションでは、Ktorが提供する[Authentication JWT](server-jwt.md)プラグインとともに、そのような鍵がどのように生成され、使用されるかを学びます。

<warning>
<p>
本番環境での使用には、RSAと比較してより効率的で安全な暗号化に基づく[ES256](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)のような、よりモダンな代替手段を選択することをお勧めします。
</p>
</warning>

## RSA秘密鍵の生成

秘密鍵を生成するには、OpenSSL、`ssh-keygen`、または認証鍵ペアを作成するための別のツールを使用できます。デモンストレーション目的のため、OpenSSLを使用します。

新しいターミナルウィンドウで、次のコマンドを実行します。

<code-block lang="shell" code="openssl genpkey -algorithm rsa -pkeyopt rsa_keygen_bits:2048 &amp;gt; ktor.pk8"/>

[openssl genpkey](https://www.openssl.org/docs/man3.0/man1/openssl-genpkey.html)コマンドは、RSAアルゴリズムを使用して2048ビットの秘密鍵を生成し、指定されたファイル（この場合は`ktor.pk8`）に保存します。ファイルのコンテンツは[Base64](https://en.wikipedia.org/wiki/Base64)エンコードされているため、公開鍵を派生させる前にデコードする必要があります。

> [コード例](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256/)から秘密鍵を使用するには、`src/main/resources`内の`application.conf`ファイルに移動し、新しい`.pk8`ファイルに秘密鍵を抽出してください。
>
{style="tip"}

## 公開鍵の派生 {id="second-step"}

以前に生成した秘密鍵から公開鍵を派生させるには、以下の手順を実行する必要があります。

1. 秘密鍵をデコードします。
2. 公開鍵を抽出します。
3. 公開鍵をPEM形式で保存します。

OpenSSLでこれを行うには、次のコマンドを実行します。

<code-block lang="shell" code="openssl rsa -in ktor.pk8 -pubout | tee ktor.spki"/>

* `openssl rsa`: これはRSA鍵を扱うための`OpenSSL`コマンドです。このコンテキストでは、RSA鍵に関連する操作を実行するために使用されます。
* `-in ktor.pk8`: このオプションは、OpenSSLがRSA秘密鍵を読み取る入力ファイル（`ktor.pk8`）を指定します。
* `-pubout`: このオプションは、入力ファイルで提供された秘密鍵に対応する公開鍵を出力するようにOpenSSLに指示します。
* `|`: パイプ（|）記号は、前のコマンド（`openssl rsa`によって生成された公開鍵）の出力を`tee`コマンドにリダイレクトするために使用されます。
* `tee ktor.spki`: `tee`は、標準入力から読み取り、標準出力と1つ以上のファイルの両方に書き込むコマンドラインユーティリティです。このコマンドの一部は、`tee`に受信した入力を`ktor.spki`というファイルに書き込むように指示します。したがって、公開鍵はターミナルに表示され、`ktor.spki`ファイルに保存されます。

公開鍵があれば、その指数とモジュラスの値を導出できます。

## モジュラスと指数属性の抽出

鍵ペアが手元にあるので、`jwks.json`ファイルで使用するために、公開鍵の`e`（指数）および`n`（モジュラス）属性を抽出する必要があります。これには以下の手順が必要です。

1. 作成した`.spki`ファイルから公開鍵を読み取ります。
2. 鍵に関する情報を人間が読める形式で表示します。

OpenSSLを使用してこれを行うには、次のコマンドを実行します。

<code-block lang="shell" code="openssl pkey -in ktor.spki -pubin -noout -text"/>

* `pkey`: これは秘密鍵と公開鍵を処理するためのOpenSSLコマンドラインユーティリティです。
* `-in ktor.spki`: PEM形式の公開鍵を含む入力ファイルを指定します。この場合、入力ファイルは`ktor.spki`です。
* `-pubin`: 入力ファイルに公開鍵が含まれていることを示します。このオプションがない場合、OpenSSLは入力ファイルに秘密鍵が含まれていると仮定します。
* `-noout`: このオプションは、OpenSSLがエンコードされた公開鍵を出力するのを防ぎます。コマンドは公開鍵に関する情報のみを表示し、実際の鍵はコンソールに表示されません。
* `-text`: OpenSSLに鍵のテキスト表現を表示するよう要求します。これには、鍵のタイプ、サイズ、および人間が読める形式の実際の鍵データなどの詳細が含まれます。

期待される出力は次のようになります。

```Shell
$ openssl pkey -in ktor.spki -pubin -noout -text
RSA Public-Key: (512 bit)
Modulus:
    00:b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:
    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:
    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:
    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:
    2b:d0:87:b4:01
Exponent: 65537 (0x10001)
```

<warning>
<p>
この例では公開鍵が512ビットを使用しており、安全ではないことに注意してください。理想的には、2048ビットまたは4096ビットの鍵を選択すべきです。
</p>
</warning>

## モジュラスと指数属性の変換とエンコード

前のステップで、`jwks.json`ファイルに必要な`n`と`e`属性を抽出しました。しかし、それらは16進数形式です。次に、指数とモジュラスの16進数表現をそれぞれの[Base64URL](https://en.wikipedia.org/wiki/Base64#URL_applications)エンコーディングに変換する必要があります。

### 指数

指数属性のHEX値は`0x10001`です。この値をBase64URLに変換するには、次のコマンドを使用します。

<code-block lang="shell" code="echo 010001 | xxd -p -r | base64 "/>

* `echo 010001`: このコマンドの一部は、`echo`コマンドを使用して文字列「010001」を標準出力に出力します。これはRSA鍵の公開指数（e）を表します。
* `|`: `|`文字はパイプであり、先行するコマンドの出力を受け取り、それを次のコマンドへの入力として渡します。
* `xxd -p -r`: このコマンドは16進数をバイナリに変換するために使用されます。16進数入力を受け取り、対応するバイナリ出力を生成します。
* `| base64`: このコマンドの一部は、前のステップからのバイナリ出力を受け取り、`base64`コマンドを使用してBase64形式でエンコードします。

<note>
<p>
左側に0を追加することで、HEX桁の数が偶数になるようにしています。
</p>
</note>

前述の指数値に対する期待される出力は次のとおりです。

```Shell
$ echo 010001 | xxd -p -r | base64
AQAB
```

指数のBase64URLエンコード値は`AQAB`であり、このケースではそれ以上の処理は必要ありません。他のケースでは、次のステップで示すように`tr`コマンドを使用する必要があるかもしれません。

### モジュラス

`n`属性については、`tr`ユーティリティを使用してモジュラスの16進数表現をさらに処理します。

<code-block lang="shell" code="echo &quot;b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:&#10;    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:&#10;    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:&#10;    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:&#10;    2b:d0:87:b4:01&quot; | tr -d &quot;: 
&quot; | xxd -p -r | base64 | tr +/ -_ | tr -d &quot;=
&quot;"/>

<note>
<p>
先頭の00バイトは省略されていることに注意してください。モジュラスの先頭の00バイトは、RSA公開鍵のASN.1エンコーディングに関連しています。整数のASN.1 DERエンコーディングでは、整数の最上位ビットが0である場合、先頭のゼロバイトは削除されます。これはASN.1エンコーディング規則の標準的な部分です。RSA公開鍵のコンテキストでは、モジュラスはビッグエンディアン整数であり、DERエンコーディングで表現される場合、これらの規則に従います。先頭のゼロバイトの削除は、整数がDER規則に従って正しく解釈されることを保証するために行われます。
</p>
</note>

* `echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5: \ ... "`: このコマンドの一部は、一連のバイトを表す複数行の16進数文字列をエコーします。各行の末尾にあるバックスラッシュは行の継続を示します。
* `tr -d ": 
"`: `tr`コマンドは、引数リストで指定された文字を削除するために使用されます。ここでは、16進数文字列からコロン、スペース、改行文字を削除し、連続した16進数文字列にします。
* `xxd -p -r`: `xxd`は、バイナリファイルの16進ダンプを作成したり、16進ダンプをバイナリに戻したりするためのユーティリティです。`-p`オプションは、行番号やASCII文字列を含まないプレーンな16進ダンプを指定します。`-r`オプションは操作を反転させ、16進数をバイナリに戻します。
* `base64`: 前のステップからのバイナリ出力をBase64形式にエンコードします。
* `tr +/ -_`: Base64出力の`+`および`/`文字をそれぞれ`-`および`_`に変換します。これはURLセーフなBase64エンコーディングのための一般的な変更です。
* `tr -d "=
"`: 最終的なBase64エンコード文字列から、等号（`=`）と改行文字を削除します。

上記のコマンドの出力は次のとおりです。

```Shell
$ echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:
    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:
    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:
    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:
    2b:d0:87:b4:01" | tr -d ": 
" | xxd -p -r | base64 | tr +/ -_ | tr -d "=
"
tfJaLrzXILUg1U3N1KV8yJr92GHn5OtYZR7qWk1Mc4cy4JGjklYup7weMjBD9f3bBVoIsiUVX6xNcYIr0Ie0AQ
```

`tr`コマンドを適切に活用することで、モジュラスフィールドは`jwks.json`ファイルで使用できるBase64URL文字列にエンコードされました。

## jwks.jsonファイルへの情報の入力

これまでの手順で、以下の必要な情報を収集しました。

1. RSA鍵ペア。
2. Base64URL形式のRSA公開鍵のモジュラス。
3. Base64URL形式のRSA公開鍵の指数。

これらが手元にあれば、Ktorプロジェクトの[jwks.json](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets)ファイルに以下の属性を入力できます。

- 前の手順で生成したBase64URLエンコード値を持つ`e`および`n`値。
- 鍵ID（この場合、`kid`はサンプルプロジェクトから派生しています）。
- `kty`属性は`RSA`。

```json
{
  "keys": [
    {
      "kty": "RSA",
      "e": "AQAB",
      "kid": "6f8856ed-9189-488f-9011-0ff4b6c08edc",
      "n":"tfJaLrzXILUg1U3N1KV8yJr92GHn5OtYZR7qWk1Mc4cy4JGjklYup7weMjBD9f3bBVoIsiUVX6xNcYIr0Ie0AQ"
    }
  ]
}
```

残りの唯一のステップは、Ktorプロジェクトが認証に使用できるように秘密鍵を指定することです。

## 秘密鍵の定義

公開鍵情報の設定が完了したら、最後のステップはKtorプロジェクトに秘密鍵へのアクセスを提供することです。

秘密鍵（最初に`.pk8`ファイルで生成したものです）をシステム上の環境変数（この場合は`jwt_pk`という名前）に抽出済みであると仮定すると、`resources/application.conf`ファイルの`jwt`セクションは次のようになるはずです。

```
jwt {
  privateKey = ${jwt_pk}
  issuer = "http://0.0.0.0:8080/"
  audience = "http://0.0.0.0:8080/login"
  realm = "MyProject"
}
```

<warning>
<p>
秘密鍵は機密情報とみなされ、コードに直接保存すべきではありません。機密データには、環境変数または[シークレットストア](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)の使用を検討してください。
</p>
</warning>