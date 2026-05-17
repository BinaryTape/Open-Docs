# 文字列のローカライズ

ローカライズ（地域化）とは、アプリを異なる言語、地域、および文化的な慣習に適応させるプロセスです。
このガイドでは、翻訳ディレクトリの設定方法、[地域固有の形式への対応](compose-regional-format.md)、[右から左に書く（RTL）言語の処理](compose-rtl.md)、およびプラットフォーム間での[ローカライズのテスト](compose-localization-tests.md)について説明します。

Compose Multiplatform で文字列をローカライズするには、サポートするすべての言語でアプリケーションのユーザーインターフェース要素の翻訳テキストを提供する必要があります。Compose Multiplatform は、共通のリソース管理ライブラリと翻訳への簡単なアクセスのためのコード生成を提供することで、このプロセスを簡素化します。

## 翻訳ディレクトリの設定

すべての文字列リソースを、共有ソースセット（common source set）内の専用の `composeResources` ディレクトリに保存します。
デフォルトのテキストを `values` ディレクトリに配置し、各言語に対応するディレクトリを作成します。
次の構造を使用します：

```
commonMain/composeResources/
├── values/
│   └── strings.xml
├── values-es/
│   └── strings.xml
├── values-fr/
│   └── strings.xml
└── ... (その他のロケールディレクトリ)
```

`values` ディレクトリとそのローカライズ版バリアント内で、キーと値のペアを使用して `strings.xml` ファイルに文字列リソースを定義します。
例えば、英語のテキストを `commonMain/composeResources/values/strings.xml` に追加します：

```xml
<resources>
    <string name="app_name">My Application</string>
    <string name="greeting">Hello, world!</string>
    <string name="welcome_message">Welcome, %s!</string>
</resources>
```

次に、翻訳用の対応するローカライズ済みファイルを作成します。例えば、スペイン語の翻訳を `commonMain/composeResources/values-es/strings.xml` に追加します：

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 静的アクセスのためのクラス生成

すべての翻訳を追加したら、プロジェクトをビルドして、リソースへのアクセスを提供する特別なクラスを生成します。
Compose Multiplatform は `composeResources` 内の `strings.xml` リソースファイルを処理し、各文字列リソースに対して静的アクセサプロパティを作成します。

生成された `Res.strings` オブジェクトを使用すると、共有コードからローカライズされた文字列に安全にアクセスできます。
アプリの UI に文字列を表示するには、`stringResource()` コンポーザブル関数を使用します。
この関数は、ユーザーの現在のロケールに基づいて適切なテキストを取得します：

```kotlin
import project.shared.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

上記の例では、`welcome_message` 文字列に動的な値のためのプレースホルダー（`%s`）が含まれています。生成されたアクセサと `stringResource()` 関数の両方が、このようなパラメータの受け渡しをサポートしています。

## 次のステップ

* [地域固有の形式の管理方法を学ぶ](compose-regional-format.md)
* [右から左に書く（Right-to-left）言語の処理について読む](compose-rtl.md)