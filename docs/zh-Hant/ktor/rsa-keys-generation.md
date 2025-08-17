[//]: # (title: RSA 密鑰生成)

<show-structure for="chapter" depth="2"/>

<var name="example_name" value="auth-jwt-rs256"/>

<tldr>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[RSA (Rivest–Shamir–Adleman)](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) 是一種廣泛使用的公鑰密碼系統，能夠實現安全的資料傳輸、數位簽章和密鑰交換。

RS256 作為 RSA 加密演算法的一部分，利用 SHA-256 進行雜湊處理，並使用一個密鑰（通常是 2048 位元、4096 位元或更高）來保護數位通訊。

在 [JSON Web Token](https://jwt.io/) 認證領域，RS256 扮演著關鍵角色，因為 JWT 的完整性和真實性可以透過簽章機制（例如 RS256）來驗證，其中採用了公/私鑰對。這確保了令牌中包含的資訊保持防篡改和可信賴。

在本節中，您將學習如何生成此類密鑰並與 Ktor 提供的 [Authentication JWT](server-jwt.md) 外掛程式一同使用。

<warning>
<p>
對於生產環境使用，建議您選擇更現代的替代方案，例如基於比 RSA 更高效、更安全的密碼學的 <a href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm">ES256</a>。
</p>
</warning>

## 生成 RSA 私鑰

要生成私鑰，您可以使用 OpenSSL、`ssh-keygen` 或其他您選擇的工具來建立認證密鑰對。為了示範目的，這裡將使用 OpenSSL。

在新的終端機視窗中，執行以下命令：

<code-block lang="shell" code="openssl genpkey -algorithm rsa -pkeyopt rsa_keygen_bits:2048 &amp;gt; ktor.pk8"/>

[`openssl genpkey`](https://www.openssl.org/docs/man3.0/man1/openssl-genpkey.html) 命令使用 RSA 演算法生成一個 2048 位元的私鑰，並將其儲存到指定檔案中，這裡是 `ktor.pk8`。檔案內容為 [Base64](https://en.wikipedia.org/wiki/Base64) 編碼，因此在推導出公鑰之前需要進行解碼。

> 要使用 [程式碼範例](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256/) 中的私鑰，請導航到 `src/main/resources` 中的 `application.conf` 檔案，並將私鑰提取到一個新的 `.pk8` 檔案中。
>
{style="tip"}

## 推導公鑰 {id="second-step"}

為了從您先前生成的私鑰中推導出公鑰，您需要執行以下步驟：

1. 解碼私鑰。
2. 提取公鑰。
3. 將公鑰儲存為 PEM 格式。

要使用 OpenSSL 執行此操作，請執行以下命令：

<code-block lang="shell" code="openssl rsa -in ktor.pk8 -pubout | tee ktor.spki"/>

* `openssl rsa`: 這是 OpenSSL 用於處理 RSA 密鑰的命令。在此情境下，它用於執行與 RSA 密鑰相關的操作。
* `-in ktor.pk8`: 此選項指定 OpenSSL 應從中讀取 RSA 私鑰的輸入檔案 (`ktor.pk8`)。
* `-pubout`: 此選項指示 OpenSSL 輸出輸入檔案中提供的私鑰所對應的公鑰。
* `|`: 管道符號 (|) 用於將前一個命令（由 `openssl rsa` 生成的公鑰）的輸出重定向到 `tee` 命令。
* `tee ktor.spki`: `tee` 是一個命令列工具程式，它從標準輸入讀取並寫入到標準輸出和一個或多個檔案。命令的這部分指示 `tee` 將接收到的輸入寫入名為 `ktor.spki` 的檔案中。因此，公鑰將同時顯示在終端機上並儲存到 `ktor.spki` 檔案中。

有了公鑰，您現在可以推導出它的指數（exponent）和模數（modulus）值。

## 提取模數與指數屬性

現在您擁有了密鑰對，您需要提取公鑰的 `e`（指數）和 `n`（模數）屬性，以便在您的 `jwks.json` 檔案中使用它們。這需要以下步驟：

1. 從您建立的 `.spki` 檔案中讀取公鑰。
2. 以人類可讀的格式顯示關於密鑰的資訊。

要使用 OpenSSL 執行此操作，請執行以下命令：

<code-block lang="shell" code="openssl pkey -in ktor.spki -pubin -noout -text"/>

* `pkey`: 這是 OpenSSL 的命令列工具程式，用於處理私鑰和公鑰。
* `-in ktor.spki`: 指定包含 PEM 格式公鑰的輸入檔案。在此情況下，輸入檔案為 `ktor.spki`。
* `-pubin`: 表示輸入檔案包含一個公鑰。如果沒有此選項，OpenSSL 會假定輸入檔案包含私鑰。
* `-noout`: 此選項阻止 OpenSSL 輸出編碼的公鑰。該命令將只顯示公鑰的資訊，而實際的密鑰不會被列印到控制台。
* `-text`: 請求 OpenSSL 顯示密鑰的文字表示。這包括密鑰類型、大小以及以人類可讀形式的實際密鑰資料等詳細資訊。

預期的輸出如下所示：

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
請注意，在此範例中，公鑰使用 512 位元，這不夠安全。理想情況下，您應該選擇 2048 位元或 4096 位元的密鑰。
</p>
</warning>

## 轉換和編碼模數和指數屬性

在上一步驟中，您提取了 `jwks.json` 檔案所需的 `n` 和 `e` 屬性。然而，它們是十六進位格式。您現在需要將指數和模數的十六進位表示轉換為各自的 [Base64URL](https://en.wikipedia.org/wiki/Base64#URL_applications) 編碼。

### 指數

指數屬性的十六進位值為 `0x10001`。要將此值轉換為 Base64URL，請使用以下命令：

<code-block lang="shell" code="echo 010001 | xxd -p -r | base64 "/>

* `echo 010001`: 命令的這部分使用 `echo` 命令將字串 "010001" 輸出到標準輸出，該字串代表 RSA 密鑰的公有指數（e）。
* `|`: `|` 字元是一個管道，它將前一個命令的輸出作為輸入傳遞給後續命令。
* `xxd -p -r`: 此命令用於將十六進位轉換為二進位。它接收十六進位輸入並產生對應的二進位輸出。
* `| base64`: 命令的這部分接收上一步驟的二進位輸出，並使用 `base64` 命令將其編碼為 Base64 格式。

<note>
<p>
請注意，透過在左側添加額外的 `0`，使用了偶數個十六進位數字。
</p>
</note>

以下是上述指數值的預期輸出：

```Shell
$ echo 010001 | xxd -p -r | base64
AQAB
```

指數的 Base64URL 編碼值是 `AQAB`，對於此情況不需要進一步處理。在其他情況下，您可能需要使用下一個步驟中所示的 `tr` 命令。

### 模數

對於 `n` 屬性，您將使用 `tr` 工具程式來進一步處理模數的十六進位表示。

<code-block lang="shell" code="echo &quot;b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:&#10;    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:&#10;    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:&#10;    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:&#10;    2b:d0:87:b4:01&quot; | tr -d &quot;: 
&quot; | xxd -p -r | base64 | tr +/ -_ | tr -d &quot;=
&quot;"/>

<note>
<p>
請注意，開頭的 `00` 位元組已被省略。模數中開頭的 `00` 位元組與 RSA 公鑰的 ASN.1 編碼有關。在整數的 ASN.1 DER 編碼中，如果整數的最高有效位元為 `0`，則會移除開頭的零位元組。這是 ASN.1 編碼規則的標準部分。在 RSA 公鑰的上下文中，模數是一個大端序整數，當以 DER 編碼表示時，它遵循這些規則。移除開頭的零位元組是為了確保整數根據 DER 規則正確解釋。
</p>
</note>

* `echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5: \ ... "`: 命令的這部分回顯了一個多行十六進位字串，表示一系列位元組。每行末尾的反斜線表示行續接。
* `tr -d ": 
"`: `tr` 命令用於刪除參數列表指定的字元。在這裡，它從十六進位字串中刪除冒號、空格和換行符，使其成為連續的十六進位數字字串。
* `xxd -p -r`: `xxd` 是一個工具程式，用於建立二進位檔案的十六進位傾印，或將十六進位傾印轉換回二進位。`-p` 選項指定純十六進位傾印，不帶行號或 ASCII 字元列。`-r` 選項反轉操作，將十六進位轉換回二進位。
* `base64`: 將上一步驟的二進位輸出編碼為 Base64 格式。
* `tr +/ -_`: 將 Base64 輸出中的 `+` 和 `/` 字元分別轉換為 `-` 和 `_`。這是 URL 安全 Base64 編碼的常見修改。
* `tr -d "=
"`: 從最終的 Base64 編碼字串中移除任何等號 (=) 和換行符。

上述命令的輸出為：

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

透過適當地利用 `tr` 命令，模數字段已被編碼為 Base64URL 字串，您可以在 `jwks.json` 檔案中使用它。

## 填充 jwks.json 檔案

在先前的步驟中，您收集了以下必要資訊：

1. 一對 RSA 密鑰。
2. Base64URL 格式的 RSA 公鑰模數。
3. Base64URL 格式的 RSA 公鑰指數。

有了這些，您現在可以使用以下屬性填充 Ktor 專案的 [jwks.json](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) 檔案：

- `e` 和 `n` 值，使用您在先前步驟中生成的 Base64URL 編碼值。
- 密鑰 ID（在此情況下，`kid` 是從範例專案中推導出來的）。
- `kty` 屬性為 `RSA`。

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

唯一剩下的步驟是指定您的私鑰，以便您的 Ktor 專案可以使用它進行認證。

## 定義私鑰

在您的公鑰資訊設定完成後，最後一步是讓您的 Ktor 專案能夠存取您的私鑰。

假設您已將私鑰（您在一開始在 `.pk8` 檔案中生成）提取到您系統上的環境變數中，在此情況下稱為 `jwt_pk`，那麼您 `resources/application.conf` 檔案的 `jwt` 部分應類似於：

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
您的私鑰被視為敏感資訊，不應直接儲存在程式碼中。考慮使用環境變數或 <a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">秘密儲存庫</a> 來儲存敏感資料。
</p>
</warning>