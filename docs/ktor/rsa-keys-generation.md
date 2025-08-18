[//]: # (title: RSA 密钥生成)

<show-structure for="chapter" depth="2"/>

<var name="example_name" value="auth-jwt-rs256"/>

<tldr>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[RSA (Rivest–Shamir–Adleman)](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) 是一种广泛使用的公钥密码系统，它支持安全数据传输、数字签名和密钥交换。

RS256 作为 RSA 加密算法的一部分，利用 SHA-256 进行散列以及一个密钥（通常为 2048 位、4096 位或更高）来保护数字通信安全。

在 [JSON Web Token](https://jwt.io/) 认证领域中，RS256 扮演着关键角色，因为 JWT 的完整性和真实性可以通过签名机制（例如 RS256）进行验证，其中采用了公钥/私钥对。这确保了令牌中包含的信息防篡改且可信。

在本节中，你将学习这些密钥是如何生成并与 Ktor 提供的 [Authentication JWT](server-jwt.md) 插件一同使用的。

<warning>
<p>
    对于生产环境使用，建议你选择更现代的替代方案，例如基于比 RSA 更高效、更安全的密码学的 <a href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm">ES256</a>。
</p>
</warning>

## 生成 RSA 私钥

要生成私钥，你可以使用 OpenSSL、`ssh-keygen` 或你选择的其他工具来创建认证密钥对。为演示目的，此处将使用 OpenSSL。

在新终端窗口中，运行以下命令：

<code-block lang="shell" code="openssl genpkey -algorithm rsa -pkeyopt rsa_keygen_bits:2048 &amp;gt; ktor.pk8"/>

[openssl genpkey](https://www.openssl.org/docs/man3.0/man1/openssl-genpkey.html) 命令使用 RSA 算法生成一个 2048 位私钥，并将其存储到指定文件，此处为 `ktor.pk8`。该文件内容经过 [Base64](https://en.wikipedia.org/wiki/Base64) 编码，因此在派生公钥之前需要进行解码。

> 要使用 [代码示例](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256/) 中的私钥，请导航到 `src/main/resources` 下的 `application.conf` 文件，并将私钥提取到一个新的 `.pk8` 文件中。
>
{style="tip"}

## 派生公钥 {id="second-step"}

为了从你之前生成的私钥中派生公钥，你需要执行以下步骤：

1. 解码私钥。
2. 提取公钥。
3. 将公钥保存为 PEM 格式。

使用 OpenSSL 执行此操作，请运行以下命令：

<code-block lang="shell" code="openssl rsa -in ktor.pk8 -pubout | tee ktor.spki"/>

* `openssl rsa`: 这是用于处理 RSA 密钥的 `OpenSSL` 命令。在此上下文中，它用于执行与 RSA 密钥相关的操作。
* `-in ktor.pk8`: 此选项指定输入文件（`ktor.pk8`），OpenSSL 应从中读取 RSA 私钥。
* `-pubout`: 此选项指示 OpenSSL 输出输入文件中提供的私钥对应的公钥。
* `|`: 管道 (|) 符号用于将前一个命令（由 openssl rsa 生成的公钥）的输出重定向到 tee 命令。
* `tee ktor.spki`: `tee` 是一个命令行工具，它从标准输入读取并写入标准输出以及一个或多个文件。此命令部分指示 tee 将接收到的输入写入名为 `ktor.spki` 的文件。因此，公钥将同时显示在终端上并保存到 `ktor.spki` 文件中。

有了公钥，你现在可以派生其指数和模数值。

## 提取模数与指数属性

现在你已经有了密钥对，你需要提取公钥的 `e`（指数）和 `n`（模数）属性，以便在你的 `jwks.json` 文件中使用它们。这需要以下步骤：

1. 从你创建的 `.spki` 文件中读取公钥。
2. 以人类可读的格式显示关于密钥的信息。

使用 OpenSSL 执行此操作，请运行以下命令：

<code-block lang="shell" code="openssl pkey -in ktor.spki -pubin -noout -text"/>

* `pkey`: 这是 OpenSSL 命令行工具，用于处理私钥和公钥。
* `-in ktor.spki`: 指定包含 PEM 格式公钥的输入文件。在本例中，输入文件是 `ktor.spki`。
* `-pubin`: 表明输入文件包含公钥。如果没有此选项，OpenSSL 将假定输入文件包含私钥。
* `-noout`: 此选项阻止 OpenSSL 输出编码后的公钥。该命令将只显示关于公钥的信息，实际密钥不会打印到控制台。
* `-text`: 请求 OpenSSL 显示密钥的文本表示。这包括密钥类型、大小和实际密钥数据等详细信息，以人类可读的形式。

预期输出如下所示：

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
    请注意，在此示例中，公钥使用 512 位，这是不安全的。理想情况下，你应该选择 2048 位或 4096 位密钥。
</p>
</warning>

## 转换并编码模数与指数属性

在前面的步骤中，你提取了 `jwks.json` 文件所需的 `n` 和 `e` 属性。然而，它们是十六进制格式的。你现在需要将指数和模数的十六进制表示转换为它们对应的 [Base64URL](https://en.wikipedia.org/wiki/Base64#URL_applications) 编码。

### 指数

指数属性的十六进制值为 `0x10001`。要将该值转换为 Base64URL，请使用以下命令：

<code-block lang="shell" code="echo 010001 | xxd -p -r | base64 "/>

* `echo 010001`: 此命令部分使用 `echo` 命令将字符串 "010001"（它表示 RSA 密钥的公有指数 (e)）输出到标准输出。
* `|`: `|` 字符是一个管道，它获取前一个命令的输出并将其作为输入传递给下一个命令。
* `xxd -p -r`: 此命令用于将十六进制转换为二进制。它接收十六进制输入并生成对应的二进制输出。
* `| base64`: 此命令部分获取上一步的二进制输出，并使用 `base64` 命令将其编码为 Base64 格式。

<note>
<p>
    请注意，通过在左侧添加一个额外的 0，使用了偶数位十六进制数字。
</p>
</note>

这是上述指数值的预期输出：

```Shell
$ echo 010001 | xxd -p -r | base64
AQAB
```

指数的 Base64URL 编码值为 `AQAB`，在本例中不需要进一步处理。在其他情况下，你可能需要使用 `tr` 命令，如下一步所示。

### 模数

对于 `n` 属性，你将使用 `tr` 工具来进一步处理模数的十六进制表示。

<code-block lang="shell" code="echo &quot;b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:&#10;    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:&#10;    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:&#10;    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:&#10;    2b:d0:87:b4:01&quot; | tr -d &quot;: 
&quot; | xxd -p -r | base64 | tr +/ -_ | tr -d &quot;=
&quot;"/>

<note>
<p>
    请注意，前导 00 字节已被省略。模数中的前导 00 字节与 RSA 公钥的 ASN.1 编码相关。在整数的 ASN.1 DER 编码中，如果整数的最高有效位是 0，则会移除前导零字节。这是 ASN.1 编码规则的标准部分。在 RSA 公钥的上下文中，模数是一个大端整数，当在 DER 编码中表示时，它遵循这些规则。移除前导零字节是为了确保根据 DER 规则正确解释整数。
</p>
</note>

* `echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5: \ ... "`: 此命令部分回显一个多行十六进制字符串，表示一系列字节。每行末尾的反斜杠表示行延续。
* `tr -d ": 
"`: `tr` 命令用于删除参数列表中指定的字符。在这里，它从十六进制字符串中移除冒号、空格和换行符，使其成为一个连续的十六进制数字字符串。
* `xxd -p -r`: `xxd` 是一个用于创建二进制文件十六进制转储或将十六进制转储转换回二进制的工具。`-p` 选项指定纯十六进制转储，不带行号或 ASCII 字符列。`-r` 选项反转操作，将十六进制转换回二进制。
* `base64`: 将上一步的二进制输出编码为 Base64 格式。
* `tr +/ -_`: 分别将 Base64 输出中的 `+` 和 `/` 字符转换为 `-` 和 `_`。这是 URL 安全的 Base64 编码的常见修改。
* `tr -d "=
"`: 从最终的 Base64 编码字符串中移除所有等号 (=) 和换行符。

上述命令的输出为：

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

通过正确利用 `tr` 命令，模数字段已编码为 Base64URL 字符串，你可以在 `jwks.json` 文件中使用它。

## 填充 jwks.json 文件

在前面的步骤中，你收集了以下必要信息：

1. 一个 RSA 密钥对。
2. Base64URL 格式的 RSA 公钥模数。
3. Base64URL 格式的 RSA 公钥指数。

有了这些，你现在可以用以下属性填充你的 Ktor 项目的 [jwks.json](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) 文件：

- 将 `e` 和 `n` 的值设置为你在前面步骤中生成的 Base64URL 编码值。
- 一个密钥 ID（在本例中，`kid` 从示例项目中派生）。
- 将 `kty` 属性设置为 `RSA`。

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

唯一剩余的步骤是指定你的私钥，以便你的 Ktor 项目可以将其用于认证。

## 定义私钥

设置好公钥信息后，最后一步是让你的 Ktor 项目能够访问你的私钥。

假设你已将私钥（你在开头生成的 `.pk8` 文件中的私钥）提取到系统上的环境变量中，在本例中称为 `jwt_pk`，那么你的 `resources/application.conf` 文件的 jwt 部分应类似于：

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
    你的私钥被视为敏感信息，不应直接存储在代码中。考虑使用环境变量或 <a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">秘密存储</a> 来存放敏感数据。
</p>
</warning>