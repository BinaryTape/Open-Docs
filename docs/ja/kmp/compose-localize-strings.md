# 文字列のローカライズ

ローカライズとは、アプリを異なる言語、地域、文化的な慣習に適応させるプロセスです。このガイドでは、翻訳ディレクトリの設定方法、[地域固有のフォーマットの扱い方](compose-regional-format.md)、[右から左へ記述する (RTL) 言語の扱い方](compose-rtl.md)、およびプラットフォーム横断的な[ローカライズのテスト方法](compose-localization-tests.md)について説明します。

Compose Multiplatform で文字列をローカライズするには、サポートされているすべての言語でアプリケーションのユーザーインターフェース要素に対して翻訳済みのテキストを提供する必要があります。Compose Multiplatform は、共通のリソース管理ライブラリと、翻訳への簡単なアクセスを可能にするコード生成を提供することで、このプロセスを簡素化します。

## 翻訳ディレクトリの設定

すべての文字列リソースは、共通のソースセット内にある専用の `composeResources` ディレクトリに格納します。デフォルトのテキストは `values` ディレクトリに配置し、各言語に対応するディレクトリを作成します。以下の構造を使用します。

```
commonMain/composeResources/
├── values/
│   └── strings.xml
├── values-es/
│   └── strings.xml
├── values-fr/
│   └── strings.xml
└── ... (other locale directories)
```

`values` ディレクトリとそのローカライズされたバリアント内で、`strings.xml` ファイルを使ってキーと値のペアで文字列リソースを定義します。たとえば、英語のテキストを `commonMain/composeResources/values/strings.xml` に追加します。

```xml
<resources>
    <string name="app_name">My Application</string>
    <string name="greeting">Hello, world!</string>
    <string name="welcome_message">Welcome, %s!</string>
</resources>
```

次に、翻訳用の対応するローカライズファイルを作成します。たとえば、スペイン語の翻訳を `commonMain/composeResources/values-es/strings.xml` に追加します。

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 静的アクセス用のクラスを生成する

すべての翻訳を追加したら、プロジェクトをビルドして、リソースへのアクセスを提供する特別なクラスを生成します。Compose Multiplatform は、`composeResources` 内の `strings.xml` リソースファイルを処理し、各文字列リソースに対して静的なアクセサープロパティを作成します。

結果として生成される `Res.strings` オブジェクトを使用すると、共有コードからローカライズされた文字列に安全にアクセスできます。アプリのUIに文字列を表示するには、`stringResource()` コンポーザブル関数を使用します。この関数は、ユーザーの現在のロケールに基づいて適切なテキストを取得します。

```kotlin
import project.composeapp.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

上記の例では、`welcome_message` 文字列には動的な値のプレースホルダー (`%s`) が含まれています。生成されたアクセサーも `stringResource()` 関数も、このようなパラメータの引き渡しをサポートしています。

## 次のステップ

*   [地域ごとのフォーマットの管理方法を学ぶ](compose-regional-format.md)
*   [右から左へ記述する言語の扱い方について読む](compose-rtl.md)