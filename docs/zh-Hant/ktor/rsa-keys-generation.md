[//]: # (title: RSA 金鑰生成)

<show-structure for="chapter" depth="2"/>

<var name="example_name" value="auth-jwt-rs256"/>

<tldr>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[RSA (Rivest–Shamir–Adleman)](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) 是一種廣泛使用的公開金鑰密碼系統，能夠實現安全的資料傳輸、數位簽章和金鑰交換。

RS256 作為 RSA 加密演算法的一部分，利用 SHA-256 進行雜湊處理，並使用金鑰（通常為 2048 位元、4096 位元或更高）來保護數位通訊。

在 [JSON Web Token](https://jwt.io/) 身份驗證領域中，RS256 扮演著關鍵角色，因為 JWT 的完整性與身份真實性可以透過簽章機制（例如 RS256，其中使用公/私鑰對）來驗證。這確保了權杖中包含的資訊能夠防竄改且可信任。

在本節中，您將學習如何生成此類金鑰並與 Ktor 提供的 [Authentication JWT](server-jwt.md) 外掛程式一起使用。

<warning>
<p>
對於生產環境的使用，建議您選擇更現代的替代方案，例如基於更高效、更安全的密碼學的 <a href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm">ES256</a>，而非 RSA。
</p>
</warning>

## 生成 RSA 私鑰

要生成私鑰，您可以使用 OpenSSL、`ssh-keygen` 或您選擇的其他工具來建立身份驗證金鑰對。為了示範目的，將使用 OpenSSL。

在新的終端機視窗中，執行以下命令：

<code-block lang="shell">
openssl genpkey -algorithm rsa -pkeyopt rsa_keygen_bits:2048 &gt; ktor.pk8
</code-block>

[openssl genpkey](https://www.openssl.org/docs/man3.0/man1/openssl-genpkey.html) 命令使用 RSA 演算法生成一個 2048 位元的私鑰，並將其儲存在指定的檔案中，此處為 `ktor.pk8`。該檔案的內容是 [Base64](https://en.wikipedia.org/wiki/Base64) 編碼的，因此在可以衍生公鑰之前，需要先進行解碼。

> 要使用來自[程式碼範例](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256/)的私鑰，請導航到 `src/main/resources` 中的 `application.conf` 檔案，並將私鑰提取到新的 `.pk8` 檔案中。
>
{style="tip"}

## 衍生公鑰 {id="second-step"}

為了從您先前生成的私鑰中衍生公鑰，您需要執行以下步驟：

1. 解碼私鑰。
2. 提取公鑰。
3. 將公鑰以 PEM 格式儲存。

要使用 OpenSSL 執行此操作，請運行以下命令：

<code-block lang="shell">
openssl rsa -in ktor.pk8 -pubout | tee ktor.spki
</code-block>

* `openssl rsa`: 這是用於處理 RSA 金鑰的 `OpenSSL` 命令。在此上下文中，它用於執行與 RSA 金鑰相關的操作。
* `-in ktor.pk8`: 此選項指定 OpenSSL 應從中讀取 RSA 私鑰的輸入檔案 (`ktor.pk8`)。
* `-pubout`: 此選項指示 OpenSSL 輸出與輸入檔案中提供的私鑰相對應的公鑰。
* `|`: 管道 (|) 符號用於將上一個命令（由 openssl rsa 生成的公鑰）的輸出重定向到 tee 命令。
* `tee ktor.spki`: `tee` 是一個命令列工具，它從標準輸入讀取並寫入標準輸出和一個或多個檔案。此命令部分指示 tee 將接收到的輸入寫入名為 `ktor.spki` 的檔案。因此，公鑰將同時顯示在終端機上並儲存在 `ktor.spki` 檔案中。

有了公鑰，您現在可以衍生其指數和模數值。

## 提取模數與指數屬性

現在您已經擁有金鑰對，您需要提取公鑰的 `e` (指數) 和 `n` (模數) 屬性，以便在您的 `jwks.json` 檔案中使用它們。這需要以下步驟：

1. 從您建立的 `.spki` 檔案中讀取公鑰。
2. 以人類可讀的格式顯示金鑰資訊。

要使用 OpenSSL 執行此操作，請運行以下命令：

<code-block lang="shell">
openssl pkey -in ktor.spki -pubin -noout -text
</code-block>

* `pkey`: 這是用於處理私鑰和公鑰的 OpenSSL 命令列工具。
* `-in ktor.spki`: 指定包含 PEM 格式公鑰的輸入檔案。在本例中，輸入檔案為 `ktor.spki`。
* `-pubin`: 表示輸入檔案包含公鑰。如果沒有此選項，OpenSSL 將假定輸入檔案包含私鑰。
* `-noout`: 此選項阻止 OpenSSL 輸出編碼的公鑰。該命令只會顯示有關公鑰的資訊，實際金鑰不會列印到控制台。
* `-text`: 要求 OpenSSL 顯示金鑰的文字表示。這包括金鑰類型、大小和實際金鑰資料等詳細資訊，以人類可讀的形式呈現。

預期輸出如下所示：

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
請注意，此範例中公鑰使用 512 位元，這不夠安全。理想情況下，您應該選擇 2048 位元或 4096 位元的金鑰。
</p>
</warning>

## 轉換和編碼模數與指數屬性

在上一步中，您提取了 `jwks.json` 檔案所需的 `n` 和 `e` 屬性。然而，它們是十六進制格式。您現在需要將指數和模數的十六進制表示轉換為它們各自的 [Base64URL](https://en.wikipedia.org/wiki/Base64#URL_applications) 編碼。

### 指數

指數屬性的十六進制值為 `0x10001`。要將此值轉換為 Base64URL，請使用以下命令：

<code-block lang="shell">
echo 010001 | xxd -p -r | base64 
</code-block>

* `echo 010001`: 命令的這部分使用 `echo` 命令將字串 "010001"（代表 RSA 金鑰的公用指數 (e)）輸出到標準輸出。
* `|`: `|` 字元是一個管道，它將前一個命令的輸出作為輸入傳遞給後續命令。
* `xxd -p -r`: 此命令用於將十六進制轉換為二進制。它接收十六進制輸入並產生相應的二進制輸出。
* `| base64`: 命令的這部分從上一步接收二進制輸出，並使用 `base64` 命令將其編碼為 Base64 格式。

<note>
<p>
請注意，透過在左側添加額外的 0，使用了偶數個十六進制數字。
</p>
</note>

以下是上述指數值的預期輸出：

```Shell
$ echo 010001 | xxd -p -r | base64
AQAB
```

指數的 Base64URL 編碼值為 `AQAB`，在此情況下無需進一步處理。在其他情況下，您可能需要使用 `tr` 命令，如下一步所示。

### 模數

對於 `n` 屬性，您將使用 `tr` 工具來進一步處理模數的十六進制表示。

<code-block lang="shell">
echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:
    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:
    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:
    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:
    2b:d0:87:b4:01" | tr -d ": 
" | xxd -p -r | base64 | tr +/ -_ | tr -d "=
"
</code-block>

<note>
<p>
請注意，已省略開頭的 00 位元組。模數中開頭的 00 位元組與 RSA 公鑰的 ASN.1 編碼相關。在整數的 ASN.1 DER 編碼中，如果整數的最高有效位元為 0，則會移除開頭的零位元組。這是 ASN.1 編碼規則的標準部分。在 RSA 公鑰的上下文中，模數是一個大端序整數，當以 DER 編碼表示時，它遵循這些規則。移除開頭的零位元組是為了確保根據 DER 規則正確解釋整數。
</p>
</note>

* `echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5: \ ... "`: 命令的這部分會迴響一個多行十六進制字串，代表一系列位元組。每行末尾的反斜線表示續行。
* `tr -d ": 
"`: `tr` 命令用於刪除參數列表中指定的字元。此處，它從十六進制字串中移除冒號、空格和換行符，使其成為一個連續的十六進制數字字串。
* `xxd -p -r`: `xxd` 是一個用於建立二進制檔案的十六進制轉儲或將十六進制轉儲轉換回二進制的工具。`-p` 選項指定純十六進制轉儲，不含行號或 ASCII 字元列。`-r` 選項反轉操作，將十六進制轉換回二進制。
* `base64`: 將上一步的二進制輸出編碼為 Base64 格式。
* `tr +/ -_`: 將 Base64 輸出中的 `+` 和 `/` 字元分別轉換為 `-` 和 `_`。這是 URL 安全 Base64 編碼的常見修改。
* `tr -d "=
"`: 從最終的 Base64 編碼字串中移除所有等號 (`=`) 和換行符。

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

透過正確利用 `tr` 命令，模數欄位已被編碼為 Base64URL 字串，您可以在 `jwks.json` 檔案中使用它。

## 填充 jwks.json 檔案

在前面的步驟中，您收集了以下必要資訊：

1. 一個 RSA 金鑰對。
2. RSA 公鑰的模數（Base64URL 格式）。
3. RSA 公鑰的指數（Base64URL 格式）。

有了這些，您現在可以使用以下屬性來填充 Ktor 專案的 [jwks.json](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) 檔案：

- `e` 和 `n` 值，填入您在前一步中生成的 Base64URL 編碼值。
- 金鑰 ID（在本例中，`kid` 衍生自範例專案）。
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

唯一剩下的步驟是指定您的私鑰，以便您的 Ktor 專案可以用它進行身份驗證。

## 定義私鑰

設定好公鑰資訊後，最後一步是讓您的 Ktor 專案能夠存取您的私鑰。

假設您已將私鑰（您在開始時生成的 `.pk8` 檔案）提取到系統上的環境變數中，此處稱為 `jwt_pk`，那麼您的 `resources/application.conf` 檔案的 jwt 部分應類似於：

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
您的私鑰被視為敏感資訊，不應直接儲存在程式碼中。請考慮使用環境變數或<a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">秘密儲存庫</a>來儲存敏感資料。
</p>
</warning>