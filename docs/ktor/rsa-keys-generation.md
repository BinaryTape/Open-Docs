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

[RSA (Rivest–Shamir–Adleman)](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) 是一种广泛使用的公钥密码系统，可实现安全数据传输、数字签名和密钥交换。

RS256 是 RSA 加密算法的一部分，它利用 SHA-256 进行哈希处理，并使用密钥（通常为 2048 位、4096 位或更高）来保护数字通信安全。

在 [JSON Web Token](https://jwt.io/) 认证领域，RS256 扮演着关键角色，因为 JWT 的完整性和真实性可以通过签名机制（例如 RS256，其中使用了公/私钥对）进行验证。这确保了令牌中包含的信息防篡改且可信。

在本节中，你将学习如何生成此类密钥，并将其配合 Ktor 提供的 [Authentication JWT](server-jwt.md) 插件一起使用。

<warning>
<p>
对于生产环境使用，建议选择更现代的替代方案，例如 <a href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm">ES256</a>，它基于比 RSA 更高效、更安全的密码学。
</p>
</warning>

## 生成 RSA 私钥

要生成私钥，你可以使用 OpenSSL、`ssh-keygen` 或你选择的其他工具来创建认证密钥对。出于演示目的，将使用 OpenSSL。

在新的终端窗口中，运行以下命令：

[object Promise]

`openssl genpkey` 命令使用 RSA 算法生成一个 2048 位私钥，并将其存储在指定文件（此处为 `ktor.pk8`）中。该文件的内容是 [Base64](https://en.wikipedia.org/wiki/Base64) 编码的，因此，在派生出公钥之前需要对其进行解码。

> 要使用[代码示例](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256/)中的私钥，请导航到 `src/main/resources` 目录下的 `application.conf` 文件，并将私钥提取到一个新的 `.pk8` 文件中。
>
{style="tip"}

## 派生公钥 {id="second-step"}

为了从你之前生成的私钥中派生出公钥，你需要执行以下步骤：

1. 解码私钥。
2. 提取公钥。
3. 以 PEM 格式保存公钥。

为此，使用 OpenSSL 运行以下命令：

[object Promise]

* `openssl rsa`：这是用于处理 RSA 密钥的 OpenSSL 命令。在此上下文中，它用于执行与 RSA 密钥相关的操作。
* `-in ktor.pk8`：此选项指定输入文件 (`ktor.pk8`)，OpenSSL 应从中读取 RSA 私钥。
* `-pubout`：此选项指示 OpenSSL 输出输入文件中提供的私钥对应的公钥。
* `|`：管道 (|) 符号用于将前一个命令（由 `openssl rsa` 生成的公钥）的输出重定向到 `tee` 命令。
* `tee ktor.spki`：`tee` 是一个命令行工具，它从标准输入读取并将内容同时写入标准输出和一个或多个文件。命令的这一部分指示 `tee` 将接收到的输入写入名为 `ktor.spki` 的文件。因此，公钥将同时显示在终端上并保存到 `ktor.spki` 文件中。

有了公钥在手，你现在可以派生出它的指数和模数。

## 提取模数和指数属性

现在你有了密钥对，你需要提取公钥的 `e`（指数）和 `n`（模数）属性，以便在 `jwks.json` 文件中使用它们。这需要以下步骤：

1. 从你创建的 `.spki` 文件中读取公钥。
2. 以人类可读的格式显示关于密钥的信息。

为此，使用 OpenSSL 运行以下命令：

[object Promise]

* `pkey`：这是用于处理私钥和公钥的 OpenSSL 命令行工具。
* `-in ktor.spki`：指定包含 PEM 格式公钥的输入文件。在此情况下，输入文件是 `ktor.spki`。
* `-pubin`：指示输入文件包含公钥。没有此选项，OpenSSL 将假定输入文件包含私钥。
* `-noout`：此选项阻止 OpenSSL 输出编码的公钥。该命令将只显示有关公钥的信息，实际密钥不会打印到控制台。
* `-text`：请求 OpenSSL 显示密钥的文本表示。这包括密钥类型、大小以及人类可读形式的实际密钥数据等详细信息。

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
请注意，在此示例中，公钥使用了 512 位，这是不安全的。理想情况下，你应该选择 2048 位或 4096 位的密钥。
</p>
</warning>

## 转换和编码模数和指数属性

在上一步中，你提取了 `jwks.json` 文件所需的 `n` 和 `e` 属性。然而，它们是十六进制格式的。你现在需要将指数和模数的十六进制表示转换为它们各自的 [Base64URL](https://en.wikipedia.org/wiki/Base64#URL_applications) 编码。

### 指数

指数属性的十六进制值为 `0x10001`。要将此值转换为 Base64URL，请使用以下命令：

[object Promise]

* `echo 010001`：命令的这一部分使用 `echo` 命令将字符串 "010001"（表示 RSA 密钥的公有指数 `e`）输出到标准输出。
* `|`：`|` 字符是一个管道，它获取前一个命令的输出，并将其作为输入传递给下一个命令。
* `xxd -p -r`：此命令用于将十六进制转换为二进制。它接收十六进制输入并生成对应的二进制输出。
* `| base64`：命令的这一部分获取上一步的二进制输出，并使用 `base64` 命令将其以 Base64 格式编码。

<note>
<p>
请注意，通过在左侧添加一个额外的 0，使用了偶数个十六进制数字。
</p>
</note>

这是上述指数值的预期输出：

```Shell
$ echo 010001 | xxd -p -r | base64
AQAB
```

指数的 Base64URL 编码值为 `AQAB`，在此情况下不需要进一步处理。在其他情况下，你可能需要使用 `tr` 命令，如下一步所示。

### 模数

对于 `n` 属性，你将使用 `tr` 工具进一步处理模数的十六进制表示。

[object Promise]

<note>
<p>
请注意，已省略开头的 00 字节。模数中开头的 00 字节与 RSA 公钥的 ASN.1 编码有关。在整数的 ASN.1 DER 编码中，如果整数的最高有效位为 0，则会移除开头的零字节。这是 ASN.1 编码规则的标准组成部分。
在 RSA 公钥的上下文中，模数是一个大端整数，当以 DER 编码表示时，它遵循这些规则。
移除开头的零字节是为了确保根据 DER 规则正确解释该整数。
</p>
</note>

* `echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5: \ ... "`：命令的这一部分回显一个多行十六进制字符串，表示一系列字节。每行末尾的反斜杠指示行继续。
* `tr -d ": 
"`：`tr` 命令用于删除参数列表中指定的字符。在此，它从十六进制字符串中删除冒号、空格和换行符，使其成为一个连续的十六进制数字字符串。
* `xxd -p -r`：`xxd` 是一个用于创建二进制文件十六进制转储或将十六进制转储转换回二进制的工具。`-p` 选项指定纯十六进制转储，不带行号或 ASCII 字符列。`-r` 选项反转操作，将十六进制转换回二进制。
* `base64`：将上一步的二进制输出编码为 Base64 格式。
* `tr +/ -_`：将 Base64 输出中的 `+` 和 `/` 字符分别转换为 `-` 和 `_`。这是 URL 安全 Base64 编码的常见修改。
* `tr -d "=
"`：从最终的 Base64 编码字符串中删除任何等号 (`=`) 和换行符。

上述命令的输出是：

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

通过正确利用 `tr` 命令，模数字段已编码为一个 Base64URL 字符串，你可以在 `jwks.json` 文件中使用它。

## 填充 jwks.json 文件

在之前的步骤中，你收集了以下必要信息：

1. 一个 RSA 密钥对。
2. Base64URL 格式的 RSA 公钥模数。
3. Base64URL 格式的 RSA 公钥指数。

有了这些在手，你现在可以使用以下属性填充 Ktor 项目的 [jwks.json](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) 文件：

- `e` 和 `n` 值，使用你在之前步骤中生成的 Base64URL 编码值。
- 一个密钥 ID（在此情况下，`kid` 是从示例项目派生而来的）。
- `kty` 属性为 `RSA`。

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

唯一剩余的步骤是指定你的私钥，以便你的 Ktor 项目可以使用它进行认证。

## 定义私钥

公钥信息设置完成后，最后一步是为你的 Ktor 项目提供私钥的访问权限。

假设你已将私钥（你在开始时在 `.pk8` 文件中生成的）提取到系统上的一个环境变量中（在此情况下称为 `jwt_pk`），那么你的 `resources/application.conf` 文件的 `jwt` 部分应类似于：

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
你的私钥被视为敏感信息，不应直接存储在代码中。考虑使用环境变量或<a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">密钥存储</a>来存储敏感数据。
</p>
</warning>