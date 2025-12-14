[//]: # (title: コードスニペットの実行)

Kotlinコードは通常、IDE、テキストエディター、またはその他のツールで作業するプロジェクトとして編成されます。しかし、関数の動作を素早く確認したり、式の値を見つけたりしたい場合、新しいプロジェクトを作成してビルドする必要はありません。さまざまな環境でKotlinコードを即座に実行できる、これら3つの便利な方法をご覧ください。

*   IDEの[スクラッチファイル](#ide-scratches-and-worksheets)。
*   ブラウザの[Kotlin Playground](#browser-kotlin-playground)。
*   コマンドラインの[ki shell](#command-line-ki-shell)。

## IDE: スクラッチ {id="ide-scratches-and-worksheets"}

IntelliJ IDEAとAndroid StudioはKotlinの[スクラッチファイル](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)をサポートしています。

_スクラッチファイル_（または単に_スクラッチ_）を使用すると、プロジェクトと同じIDEウィンドウでコードドラフトを作成し、その場で実行できます。
スクラッチはプロジェクトに紐付けられていません。OS上の任意のIntelliJ IDEAウィンドウから、すべてのスクラッチにアクセスして実行できます。

Kotlinスクラッチを作成するには、**File** | **New** | **Scratch File** をクリックし、**Kotlin** タイプを選択します。

構文ハイライト、オートコンプリート、およびその他のIntelliJ IDEAのコード編集機能は、スクラッチでサポートされています。`main()`関数を宣言する必要はありません。記述したすべてのコードは、あたかも`main()`の本体内にあるかのように実行されます。

スクラッチでのコードの記述が完了したら、**Run** をクリックします。実行結果は、コードの反対側の行に表示されます。

![Run scratch](scratch-run.png){width=700}

### インタラクティブモード

IDEは、スクラッチのコードを自動的に実行できます。入力を停止するとすぐに実行結果を得るには、**Interactive mode** をオンにします。

![Scratch interactive mode](scratch-interactive.png){width=700}

### モジュールを使用する

Kotlinプロジェクトのクラスや関数をスクラッチで使用できます。

プロジェクトのクラスや関数をスクラッチで使用するには、通常通り`import`ステートメントでそれらをスクラッチファイルにインポートします。次にコードを記述し、**Use classpath of module** リストで適切なモジュールを選択して実行します。

スクラッチは、接続されたモジュールのコンパイル済みバージョンを使用します。そのため、モジュールのソースファイルを変更した場合、モジュールをリビルドすると変更がスクラッチに反映されます。スクラッチを実行する前にモジュールを自動的にリビルドするには、**Make module before Run** を選択します。

![Scratch select module](scratch-select-module.png){width=700}

### REPLとして実行する

スクラッチ内の個々の式を評価するには、**Use REPL** を選択して実行します。コード行は順次実行され、各呼び出しの結果が提供されます。後で、自動生成された`res*`名（対応する行に表示されます）を参照することで、同じファイル内で結果を使用できます。

![Scratch REPL](scratch-repl.png){width=700}

## ブラウザ: Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/)は、ブラウザでKotlinコードを記述、実行、共有するためのオンラインアプリケーションです。

### コードを記述および編集する

Playgroundのエディターエリアでは、ソースファイルと同じようにコードを記述できます。
*   独自のクラス、関数、トップレベル宣言を任意の順序で追加します。
*   実行可能な部分を`main()`関数の本体に記述します。

一般的なKotlinプロジェクトと同様に、Playgroundの`main()`関数は`args`パラメータを持つことも、まったくパラメータを持たないこともできます。実行時にプログラム引数を渡すには、**Program arguments** フィールドに記述します。

![Playground: code completion](playground-completion.png){width=700}

Playgroundは、入力中にコードをハイライト表示し、コード補完オプションを表示します。標準ライブラリと[`kotlinx.coroutines`](coroutines-overview.md)からの宣言を自動的にインポートします。

### 実行環境を選択する

Playgroundは、実行環境をカスタマイズする方法を提供します。
*   利用可能な[将来のバージョンのプレビュー](eap.md)を含む複数のKotlinバージョン。
*   コードを実行するための複数のバックエンド：JVM、JS（レガシーまたは[IRコンパイラ](js-ir-compiler.md)、またはCanvas）、またはJUnit。

![Playground: environment setup](playground-env-setup.png){width=700}

JSバックエンドの場合、生成されたJSコードも確認できます。

![Playground: generated JS](playground-generated-js.png){width=700}

### コードをオンラインで共有する

Playgroundを使用してコードを他のユーザーと共有するには、**Copy link** をクリックし、コードを見せたい相手に送信します。

Playgroundのコードスニペットを他のウェブサイトに埋め込んだり、実行可能にしたりすることもできます。**Share code** をクリックして、サンプルを任意のウェブページや[Medium](https://medium.com/)の記事に埋め込みます。

![Playground: share code](playground-share.png){width=700}

## コマンドライン: ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell)（_Kotlin Interactive Shell_）は、ターミナルでKotlinコードを実行するためのコマンドラインユーティリティです。Linux、macOS、Windowsで利用できます。

ki shellは、基本的なコード評価機能に加えて、次のような高度な機能を提供します。
*   コード補完
*   型チェック
*   外部依存関係
*   コードスニペットのペーストモード
*   スクリプトサポート

詳細については、[ki shell GitHubリポジトリ](https://github.com/Kotlin/kotlin-interactive-shell)を参照してください。

### ki shellをインストールして実行する

ki shellをインストールするには、[GitHub](https://github.com/Kotlin/kotlin-interactive-shell)から最新バージョンをダウンロードし、任意のディレクトリに解凍します。

macOSでは、以下のコマンドを実行することでHomebrewを使用してki shellをインストールすることもできます。

```shell
brew install ki
```

ki shellを起動するには、LinuxとmacOSでは`bin/ki.sh`（Homebrewでki shellがインストールされている場合は`ki`）、Windowsでは`bin\ki.bat`を実行します。

シェルが実行されたら、すぐにターミナルでKotlinコードを書き始めることができます。ki shellで利用可能なコマンドを確認するには、`:help`（または`:h`）と入力します。

### コード補完とハイライト

ki shellは、**Tab** キーを押すとコード補完オプションを表示します。また、入力中に構文ハイライト機能も提供します。この機能は、`:syntax off`と入力することで無効にできます。

![ki shell highlighting and completion](ki-shell-highlight-completion.png){width=700}

**Enter** キーを押すと、ki shellは入力された行を評価し、結果を出力します。式の値は、`res*`のような自動生成された名前を持つ変数として出力されます。後で、実行するコードでこれらの変数を使用できます。入力された構文が不完全な場合（例えば、条件はあるが本体がない`if`など）、シェルは3つの点を表示し、残りの部分を待機します。

![ki shell results](ki-shell-results.png){width=700}

### 式の型を確認する

よくわからない複雑な式やAPIの場合、ki shellは式の型を表示する`:type`（または`:t`）コマンドを提供します。

![ki shell type](ki-shell-type.png){width=700}

### コードをロードする

必要なコードがどこか別の場所に保存されている場合、それをki shellにロードして使用する方法は2つあります。
*   `:load`（または`:l`）コマンドでソースファイルをロードします。
*   `:paste`（または`:p`）コマンドでペーストモードでコードスニペットをコピー＆ペーストします。

![ki shell load file](ki-shell-load.png){width=700}

`ls`コマンドは、利用可能なシンボル（変数と関数）を表示します。

### 外部依存関係を追加する

標準ライブラリに加えて、ki shellは外部依存関係もサポートしています。これにより、プロジェクト全体を作成することなく、サードパーティライブラリを試すことができます。

ki shellにサードパーティライブラリを追加するには、`:dependsOn`コマンドを使用します。デフォルトでは、ki shellはMaven Centralと連携しますが、`:repository`コマンドを使用して他のリポジトリを接続すれば、それらを使用することもできます。

![ki shell external dependency](ki-shell-dependency.png){width=700}