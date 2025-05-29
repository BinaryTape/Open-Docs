[//]: # (title: コードスニペットの実行)

Kotlinコードは通常、IDE、テキストエディタ、またはその他のツールで作業するプロジェクトとして構成されています。しかし、関数の動作を素早く確認したり、式の結果を調べたりしたい場合、新しいプロジェクトを作成してビルドする必要はありません。さまざまな環境でKotlinコードを即座に実行できる3つの便利な方法を見てみましょう。

* IDEの[スクラッチファイルとワークシート](#ide-scratches-and-worksheets)。
* ブラウザの[Kotlin Playground](#browser-kotlin-playground)。
* コマンドラインの[ki shell](#command-line-ki-shell)。

## IDE: スクラッチファイルとワークシート

IntelliJ IDEAとAndroid Studioは、Kotlinの[スクラッチファイルとワークシート](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)をサポートしています。

* _スクラッチファイル_ (または単に_スクラッチ_) を使用すると、プロジェクトと同じIDEウィンドウでコードのドラフトを作成し、その場で実行できます。
  スクラッチファイルはプロジェクトに縛られません。OS上の任意のIntelliJ IDEAウィンドウから、すべてのスクラッチファイルにアクセスして実行できます。

  Kotlinスクラッチファイルを作成するには、**File** | **New** | **Scratch File**をクリックし、**Kotlin**タイプを選択します。

* _ワークシート_はプロジェクトファイルです。プロジェクトディレクトリに保存され、プロジェクトモジュールに紐付けられます。
  ワークシートは、ソフトウェアの単位を構成しないものの、教育用やデモ用資料のようにプロジェクト内でまとめて保存すべきコードの断片を作成するのに役立ちます。

  プロジェクトディレクトリ内にKotlinワークシートを作成するには、プロジェクトツリーでそのディレクトリを右クリックし、**New** | **Kotlin Class/File** | **Kotlin Worksheet**を選択します。

    > Kotlinワークシートは[K2モード](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)ではサポートされていません。同様の機能を持つ代替手段を提供するよう取り組んでいます。
    >
    {style="warning"}

構文ハイライト、自動補完、その他のIntelliJ IDEAコード編集機能は、スクラッチファイルとワークシートでサポートされています。`main()`関数を宣言する必要はありません。記述したすべてのコードは、`main()`の本体内にあるかのように実行されます。

スクラッチファイルまたはワークシートにコードを書き終えたら、**Run**をクリックします。実行結果はコードの反対側の行に表示されます。

![Run scratch](scratch-run.png){width=700}

### インタラクティブモード

IDEは、スクラッチファイルとワークシートからコードを自動的に実行できます。入力を停止するとすぐに実行結果を得るには、**Interactive mode**をオンに切り替えます。

![Scratch interactive mode](scratch-interactive.png){width=700}

### モジュールの使用

Kotlinプロジェクトのクラスや関数をスクラッチファイルやワークシートで使用できます。

ワークシートは、自身が配置されているモジュールのクラスや関数に自動的にアクセスできます。

プロジェクトのクラスや関数をスクラッチファイルで使用するには、通常通り`import`ステートメントでスクラッチファイルにインポートします。その後、コードを記述し、**Use classpath of module**リストで適切なモジュールを選択して実行します。

スクラッチファイルとワークシートはどちらも、接続されているモジュールのコンパイル済みバージョンを使用します。そのため、モジュールのソースファイルを変更した場合、モジュールを再ビルドすると変更がスクラッチファイルやワークシートに反映されます。スクラッチファイルまたはワークシートを実行する前にモジュールを自動的に再ビルドするには、**Make module before Run**を選択します。

![Scratch select module](scratch-select-module.png){width=700}

### REPLとして実行

スクラッチファイルまたはワークシート内の特定の式を個別に評価するには、**Use REPL**を選択して実行します。コード行は順次実行され、それぞれの呼び出し結果が提供されます。後で、自動生成された`res*`の名前（対応する行に表示されます）を参照することで、同じファイル内でその結果を使用できます。

![Scratch REPL](scratch-repl.png){width=700}

## ブラウザ: Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/)は、ブラウザでKotlinコードを記述、実行、共有するためのオンラインアプリケーションです。

### コードの記述と編集

Playgroundのエディタ領域では、ソースファイルに書くのと同じようにコードを記述できます。
* 任意の順序で独自のクラス、関数、トップレベル宣言を追加できます。
* 実行可能部分は`main()`関数の本体に記述します。

通常のKotlinプロジェクトと同様に、Playgroundの`main()`関数は`args`パラメータを持つことも、まったくパラメータを持たないこともできます。実行時にプログラム引数を渡すには、**Program arguments**フィールドに記述します。

![Playground: code completion](playground-completion.png){width=700}

Playgroundはコードをハイライト表示し、入力時にコード補完オプションを表示します。標準ライブラリと[`kotlinx.coroutines`](coroutines-overview.md)からの宣言を自動的にインポートします。

### 実行環境の選択

Playgroundは実行環境をカスタマイズする方法を提供します。
* 利用可能な[将来のバージョンのプレビュー](eap.md)を含む複数のKotlinバージョン。
* コードを実行するための複数のバックエンド: JVM、JS (レガシーまたは[IRコンパイラ](js-ir-compiler.md)、またはCanvas)、またはJUnit。

![Playground: environment setup](playground-env-setup.png){width=700}

JSバックエンドの場合、生成されたJSコードも確認できます。

![Playground: generated JS](playground-generated-js.png){width=700}

### コードをオンラインで共有

Playgroundを使ってコードを他の人と共有できます。**Copy link**をクリックして、コードを見せたい人に送信してください。

また、Playgroundからコードスニペットを他のウェブサイトに埋め込んだり、実行可能にしたりすることもできます。**Share code**をクリックすると、サンプルを任意のウェブページや[Medium](https://medium.com/)記事に埋め込むことができます。

![Playground: share code](playground-share.png){width=700}

## コマンドライン: ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_) は、ターミナルでKotlinコードを実行するためのコマンドラインユーティリティです。Linux、macOS、Windowsで利用可能です。

ki shellは基本的なコード評価機能に加えて、以下のような高度な機能を提供します。
* コード補完
* 型チェック
* 外部依存関係
* コードスニペット用のペーストモード
* スクリプトサポート

詳細については、[ki shell GitHubリポジトリ](https://github.com/Kotlin/kotlin-interactive-shell)を参照してください。

### ki shellのインストールと実行

ki shellをインストールするには、[GitHub](https://github.com/Kotlin/kotlin-interactive-shell)から最新バージョンをダウンロードし、任意のディレクトリに解凍します。

macOSでは、以下のコマンドを実行してHomebrewでki shellをインストールすることもできます。

```shell
brew install ki
```

ki shellを起動するには、LinuxおよびmacOSでは`bin/ki.sh` (Homebrewでki shellをインストールした場合は`ki`のみ) を、Windowsでは`bin\ki.bat`を実行します。

シェルが実行されたら、すぐにターミナルでKotlinコードを記述し始めることができます。`:help` (または`:h`) と入力すると、ki shellで利用可能なコマンドが表示されます。

### コード補完とハイライト

ki shellは**Tab**を押すとコード補完オプションを表示します。また、入力時に構文ハイライトも提供します。`:syntax off`と入力することでこの機能を無効にできます。

![ki shell highlighting and completion](ki-shell-highlight-completion.png){width=700}

**Enter**を押すと、ki shellは入力された行を評価し、結果を出力します。式の値は、`res*`のような自動生成された名前を持つ変数として出力されます。後で、実行するコード内でそのような変数を使用できます。入力された構文が不完全な場合（例えば、条件はあるが本体のない`if`文など）、シェルは3つのドットを出力し、残りの部分を待ちます。

![ki shell results](ki-shell-results.png){width=700}

### 式の型の確認

複雑な式やよく知らないAPIの場合、ki shellは式の型を表示する`:type` (または`:t`) コマンドを提供します。

![ki shell type](ki-shell-type.png){width=700}

### コードの読み込み

必要なコードが別の場所に保存されている場合、ki shellに読み込んで使用する方法は2つあります。
* `:load` (または`:l`) コマンドでソースファイルを読み込む。
* `:paste` (または`:p`) コマンドでペーストモードでコードスニペットをコピー＆ペーストする。

![ki shell load file](ki-shell-load.png){width=700}

`ls`コマンドは利用可能なシンボル（変数と関数）を表示します。

### 外部依存関係の追加

標準ライブラリに加えて、ki shellは外部依存関係もサポートしています。これにより、プロジェクト全体を作成することなく、サードパーティライブラリを試すことができます。

ki shellでサードパーティライブラリを追加するには、`:dependsOn`コマンドを使用します。デフォルトでは、ki shellはMaven Centralで動作しますが、`:repository`コマンドを使用して接続すれば他のリポジトリも使用できます。

![ki shell external dependency](ki-shell-dependency.png){width=700}