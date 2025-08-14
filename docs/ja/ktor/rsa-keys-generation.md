[//]: # (title: RSA鍵の生成)

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

[RSA (Rivest–Shamir–Adleman)](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) は、安全なデータ送信、デジタル署名、鍵交換を可能にする、広く使用されている公開鍵暗号システムです。

RS256はRSA暗号アルゴリズムの一部であり、ハッシュ化にはSHA-256を利用し、デジタル通信を保護するために鍵（通常は2048ビット、4096ビット以上）を使用します。

[JSON Web Token](https://jwt.io/)認証の領域では、公開鍵/秘密鍵ペアが使用されるRS256などの署名メカニズムを通じて、JWTの完全性と真正性を検証できるため、RS256は極めて重要な役割を果たします。これにより、トークンに含まれる情報が改ざん不能で信頼できる状態に保たれます。

このセクションでは、このような鍵がどのように生成され、Ktorが提供する[認証JWT](server-jwt.md)プラグインと共に使用されるかを学びます。

<warning>
<p>
実運用では、RSAと比較してより効率的で安全な暗号化に基づく<a href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm">ES256</a>のような、より新しい代替手段を選択することを推奨します。
</p>
</warning>

## RSA秘密鍵の生成

秘密鍵を生成するには、OpenSSL、`ssh-keygen`、または認証鍵ペアを作成するための別のツールを使用できます。デモンストレーション目的で、OpenSSLを使用します。

新しいターミナルウィンドウで、以下のコマンドを実行します。

[object Promise]

[openssl genpkey](https://www.openssl.org/docs/man3.0/man1/openssl-genpkey.html)コマンドは、RSAアルゴリズムを使用して2048ビットの秘密鍵を生成し、指定されたファイル（この場合は`ktor.pk8`）に保存します。ファイルの内容は[Base64](https://en.wikipedia.org/wiki/Base64)エンコードされているため、公開鍵を導出する前にデコードする必要があります。

> [コード例](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256/)の秘密鍵を使用するには、`src/main/resources`内の`application.conf`ファイルに移動し、秘密鍵を新しい`.pk8`ファイルに抽出します。
>
{style="tip"}

## 公開鍵の導出 {id="second-step"}

以前に生成した秘密鍵から公開鍵を導出するには、次の手順を実行する必要があります。

1.  秘密鍵をデコードする。
2.  公開鍵を抽出する。
3.  公開鍵をPEM形式で保存する。

これをOpenSSLで行うには、以下のコマンドを実行します。

[object Promise]

*   `openssl rsa`: これはRSA鍵を扱うための`OpenSSL`コマンドです。このコンテキストでは、RSA鍵に関連する操作を実行するために使用されます。
*   `-in ktor.pk8`: このオプションは、OpenSSLがRSA秘密鍵を読み取るための入力ファイル（`ktor.pk8`）を指定します。
*   `-pubout`: このオプションは、入力ファイルで提供された秘密鍵に対応する公開鍵を出力するようOpenSSLに指示します。
*   `|`: パイプ (|) 記号は、前のコマンド（`openssl rsa`によって生成された公開鍵）の出力を`tee`コマンドにリダイレクトするために使用されます。
*   `tee ktor.spki`: `tee`は、標準入力から読み込み、標準出力と1つ以上のファイルの両方に書き込むコマンドラインユーティリティです。このコマンドの一部は、受け取った入力を`ktor.spki`という名前のファイルに書き込むよう`tee`に指示します。したがって、公開鍵はターミナルに表示され、`ktor.spki`ファイルにも保存されます。

公開鍵を手元に置いて、その指数と法の値を導出できます。

## 法と指数属性の抽出

鍵ペアが手元にあるので、`jwks.json`ファイルで使用するために、公開鍵の`e` (指数) と `n` (法) 属性を抽出する必要があります。これには次の手順が必要です。

1.  作成した`.spki`ファイルから公開鍵を読み取る。
2.  鍵に関する情報を人間が読み取り可能な形式で表示する。

これをOpenSSLで行うには、以下のコマンドを実行します。

[object Promise]

*   `pkey`: これは秘密鍵と公開鍵を処理するためのOpenSSLコマンドラインユーティリティです。
*   `-in ktor.spki`: PEM形式の公開鍵を含む入力ファイルを指定します。この場合、入力ファイルは`ktor.spki`です。
*   `-pubin`: 入力ファイルに公開鍵が含まれていることを示します。このオプションがない場合、OpenSSLは入力ファイルに秘密鍵が含まれていると見なします。
*   `-noout`: このオプションは、OpenSSLがエンコードされた公開鍵を出力するのを防ぎます。コマンドは公開鍵に関する情報のみを表示し、実際の鍵はコンソールに出力されません。
*   `-text`: OpenSSLに鍵のテキスト表現を表示するよう要求します。これには、鍵のタイプ、サイズ、および実際の鍵データが人間が読み取り可能な形式で含まれます。

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
この例では公開鍵が512ビットを使用しており、これは安全ではありません。理想的には、2048ビットまたは4096ビットの鍵を選択すべきです。
</p>
</warning>

## 法と指数属性の変換とエンコード

前のステップで、`jwks.json`ファイルに必要な`n`と`e`属性を抽出しました。しかし、それらは16進数形式です。次に、指数と法の16進数表現をそれぞれの[Base64URL](https://en.wikipedia.org/wiki/Base64#URL_applications)エンコーディングに変換する必要があります。

### 指数

指数属性のHEX値は`0x10001`です。この値をBase64URLに変換するには、以下のコマンドを使用します。

[object Promise]

*   `echo 010001`: このコマンドの一部は、`echo`コマンドを使用して、RSA鍵の公開指数 (e) を表す文字列 "010001" を標準出力に出力します。
*   `|`: `|` 文字は、前のコマンドからの出力を受け取り、次のコマンドへの入力として渡すパイプです。
*   `xxd -p -r`: このコマンドは16進数をバイナリに変換するために使用されます。16進数入力を受け取り、対応するバイナリ出力を生成します。
*   `| base64`: このコマンドの一部は、前のステップからのバイナリ出力を受け取り、`base64`コマンドを使用してBase64形式にエンコードします。

<note>
<p>
左に余分な0を追加することで、偶数個のHEX桁が使用されていることに注意してください。
</p>
</note>

上記の指数値に対する期待される出力は次のとおりです。

```Shell
$ echo 010001 | xxd -p -r | base64
AQAB
```

指数のBase64URLエンコードされた値は`AQAB`であり、この場合はそれ以上の処理は必要ありません。他のケースでは、次のステップで示すように`tr`コマンドを使用する必要があるかもしれません。

### 法

`n`属性については、`tr`ユーティリティを使用して法の16進数表現をさらに処理します。

[object Promise]

<note>
<p>
先頭の00バイトが省略されていることに注意してください。法における先頭の00バイトは、RSA公開鍵のASN.1エンコーディングに関連しています。整数のASN.1 DERエンコーディングでは、整数の最上位ビットが0の場合、先頭のゼロバイトは削除されます。これはASN.1エンコーディング規則の標準的な一部です。
RSA公開鍵のコンテキストにおいて、法はビッグエンディアン整数であり、DERエンコーディングで表現される場合、これらの規則に従います。先頭のゼロバイトの削除は、DER規則に従って整数が正しく解釈されることを保証するために行われます。
</p>
</note>

*   `echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5: \ ... "`: このコマンドの一部は、一連のバイトを表す複数行の16進数文字列を出力します。各行の末尾にあるバックスラッシュは行の継続を示します。
*   `tr -d ": 
"`: `tr`コマンドは、引数リストで指定された文字を削除するために使用されます。ここでは、16進数文字列からコロン、スペース、改行文字を削除し、連続した16進数桁の文字列にします。
*   `xxd -p -r`: `xxd`は、バイナリファイルのヘックスダンプを作成したり、ヘックスダンプをバイナリに戻したりするためのユーティリティです。`-p`オプションは行番号やASCII文字カラムのないプレーンなヘックスダンプを指定します。`-r`オプションは操作を逆転させ、16進数をバイナリに戻します。
*   `base64`: 前のステップからのバイナリ出力をBase64形式にエンコードします。
*   `tr +/ -_`: Base64出力中の+と/文字をそれぞれ-と_に変換します。これはURLセーフなBase64エンコーディングのための一般的な変更です。
*   `tr -d "=
"`: 最終的なBase64エンコードされた文字列から等号 (=) と改行文字をすべて削除します。

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

`tr`コマンドを適切に活用することで、法フィールドは`jwks.json`ファイルで使用できるBase64URL文字列にエンコードされました。

## jwks.jsonファイルの生成

前のステップで、次の必要な情報を収集しました。

1.  RSA鍵ペア
2.  Base64URL形式のRSA公開鍵の法
3.  Base64URL形式のRSA公開鍵の指数

これらを活用して、Ktorプロジェクトの[jwks.json](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets)ファイルを次の属性で生成できます。

-   `e`と`n`の値は、前のステップで生成したBase64URLエンコードされた値を使用します。
-   鍵ID（この場合、`kid`はサンプルプロジェクトから導出されます）。
-   `kty`属性は`RSA`とします。

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

残された唯一のステップは、Ktorプロジェクトが認証に秘密鍵を使用できるように、秘密鍵を指定することです。

## 秘密鍵の定義

公開鍵情報が設定された状態で、最後のステップはKtorプロジェクトに秘密鍵へのアクセスを提供することです。

秘密鍵（最初に`.pk8`ファイルで生成したもの）をシステム上の環境変数に抽出したと仮定すると、この場合は`jwt_pk`という名前で、`resources/application.conf`ファイルの`jwt`セクションは次のようになります。

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
秘密鍵は機密情報と見なされ、コードに直接保存すべきではありません。機密データには環境変数または<a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">シークレットストア</a>の使用を検討してください。
</p>
</warning>