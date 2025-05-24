---
title: コードスニペットの実行
---
Kotlinのコードは通常、IDE、テキストエディタ、またはその他のツールで作業するプロジェクトに編成されます。
ただし、関数の動作をすばやく確認したり、式の値を見つけたりする場合は、新しいプロジェクトを作成してビルドする必要はありません。
さまざまな環境でKotlinコードをすぐに実行できる、次の3つの便利な方法を確認してください。

* IDEの[スクラッチファイルとワークシート](#ide-scratches-and-worksheets)。
* ブラウザの[Kotlin Playground](#browser-kotlin-playground)。
* コマンドラインの[ki shell](#command-line-ki-shell)。

## IDE: スクラッチファイルとワークシート

IntelliJ IDEAとAndroid Studioは、Kotlinの[スクラッチファイルとワークシート](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)をサポートしています。

* _スクラッチファイル_（または単に_スクラッチ_）を使用すると、プロジェクトと同じIDEウィンドウでコードのドラフトを作成し、すぐに実行できます。
  スクラッチはプロジェクトに関連付けられていません。OS上のIntelliJ IDEAウィンドウからすべてのスクラッチにアクセスして実行できます。

  Kotlinスクラッチを作成するには、**File** | **New** | **Scratch File**をクリックし、**Kotlin**タイプを選択します。

* _ワークシート_はプロジェクトファイルです。プロジェクトディレクトリに保存され、プロジェクトモジュールに関連付けられています。
  ワークシートは、ソフトウェアユニットを実際には作成しないが、教育用資料やデモ資料など、プロジェクトにまとめて保存する必要があるコードの作成に役立ちます。

  プロジェクトディレクトリにKotlinワークシートを作成するには、プロジェクトツリーでディレクトリを右クリックし、**New** | **Kotlin Class/File** | **Kotlin Worksheet**を選択します。

    > Kotlinワークシートは、[K2 mode](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)ではサポートされていません。同様の機能を提供する代替手段に取り組んでいます。
    >
    

構文の強調表示、自動補完、およびその他のIntelliJ IDEAコード編集機能は、スクラッチとワークシートでサポートされています。`main()`関数を宣言する必要はありません。記述するすべてのコードは、`main()`の本体にあるかのように実行されます。

スクラッチまたはワークシートでコードの記述が完了したら、**Run**をクリックします。
実行結果は、コードの反対側の行に表示されます。

<img src="/img/scratch-run.png" alt="Run scratch" width="700" style={{verticalAlign: 'middle'}}/>

### インタラクティブモード

IDEは、スクラッチとワークシートからコードを自動的に実行できます。入力を停止するとすぐに実行結果を取得するには、**Interactive mode**をオンにします。

<img src="/img/scratch-interactive.png" alt="Scratch interactive mode" width="700" style={{verticalAlign: 'middle'}}/>

### モジュールの使用

スクラッチとワークシートでKotlinプロジェクトのクラスまたは関数を使用できます。

ワークシートは、それが存在するモジュールのクラスと関数に自動的にアクセスできます。

プロジェクトのクラスまたは関数をスクラッチで使用するには、通常どおり、`import`ステートメントを使用してスクラッチファイルにインポートします。次に、コードを記述し、**Use classpath of module**リストで適切なモジュールを選択して実行します。

スクラッチとワークシートはどちらも、接続されたモジュールのコンパイル済みバージョンを使用します。したがって、モジュールのソースファイルを変更すると、モジュールをリビルドするときに変更がスクラッチとワークシートに伝播されます。
スクラッチまたはワークシートを実行するたびにモジュールを自動的にリビルドするには、**Make module before Run**を選択します。

<img src="/img/scratch-select-module.png" alt="Scratch select module" width="700" style={{verticalAlign: 'middle'}}/>

### REPLとして実行

スクラッチまたはワークシートで特定の式を評価するには、**Use REPL**を選択して実行します。コード行は順番に実行され、各呼び出しの結果が提供されます。
後で、自動生成された`res*`名前（対応する行に表示されます）を参照することにより、同じファイルで結果を使用できます。

<img src="/img/scratch-repl.png" alt="Scratch REPL" width="700" style={{verticalAlign: 'middle'}}/>

## ブラウザ: Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/)は、ブラウザでKotlinコードを記述、実行、共有するためのオンラインアプリケーションです。

### コードの記述と編集

Playgroundのエディタ領域では、ソースファイルと同じようにコードを記述できます。
* 独自のクラス、関数、およびトップレベルの宣言を任意の順序で追加します。
* 実行可能部分を`main()`関数の本体に記述します。

一般的なKotlinプロジェクトと同様に、Playgroundの`main()`関数は、`args`パラメータを持つことも、パラメータをまったく持たないこともできます。
実行時にプログラム引数を渡すには、**Program arguments**フィールドに記述します。

<img src="/img/playground-completion.png" alt="Playground: code completion" width="700" style={{verticalAlign: 'middle'}}/>

Playgroundはコードを強調表示し、入力時にコード補完オプションを表示します。標準ライブラリおよび[`kotlinx.coroutines`](coroutines-overview)からの宣言を自動的にインポートします。

### 実行環境の選択

Playgroundには、実行環境をカスタマイズする方法が用意されています。
* 利用可能な[将来のバージョンのプレビュー](eap)を含む、複数のKotlinバージョン。
* コードを実行するための複数のバックエンド：JVM、JS（レガシーまたは[IR compiler](js-ir-compiler)、またはCanvas）、またはJUnit。

<img src="/img/playground-env-setup.png" alt="Playground: environment setup" width="700" style={{verticalAlign: 'middle'}}/>

JSバックエンドの場合、生成されたJSコードも確認できます。

<img src="/img/playground-generated-js.png" alt="Playground: generated JS" width="700" style={{verticalAlign: 'middle'}}/>

### コードをオンラインで共有

Playgroundを使用してコードを他のユーザーと共有します。**Copy link**をクリックして、コードを表示したい人に送信します。

Playgroundからのコードスニペットを他のWebサイトに埋め込んだり、実行可能にしたりすることもできます。**Share code**をクリックして、サンプルを任意のWebページまたは[Medium](https://medium.com/)記事に埋め込みます。

<img src="/img/playground-share.png" alt="Playground: share code" width="700" style={{verticalAlign: 'middle'}}/>

## コマンドライン: ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell)（_Kotlin Interactive Shell_）は、ターミナルでKotlinコードを実行するためのコマンドラインユーティリティです。Linux、macOS、およびWindowsで利用できます。

ki shellは、基本的なコード評価機能に加えて、次のような高度な機能を提供します。
* コード補完
* 型チェック
* 外部依存関係
* コードスニペットの貼り付けモード
* スクリプトサポート

詳細については、[ki shell GitHubリポジトリ](https://github.com/Kotlin/kotlin-interactive-shell)を参照してください。

### ki shellのインストールと実行

ki shellをインストールするには、[GitHub](https://github.com/Kotlin/kotlin-interactive-shell)から最新バージョンをダウンロードし、
任意のディレクトリに解凍します。

macOSでは、次のコマンドを実行して、Homebrewでki shellをインストールすることもできます。

```shell
brew install ki
```

ki shellを起動するには、LinuxおよびmacOSで`bin/ki.sh`（またはHomebrewでki shellがインストールされている場合は`ki`）を実行するか、
Windowsで`bin\ki.bat`を実行します。

シェルが実行されると、ターミナルでKotlinコードの記述をすぐに開始できます。`:help`（または`:h`）と入力して、ki shellで使用できるコマンドを表示します。

### コード補完と強調表示

ki shellは、**Tab**キーを押すとコード補完オプションを表示します。また、入力時に構文を強調表示します。
`:syntax off`と入力すると、この機能を無効にできます。

<img src="/img/ki-shell-highlight-completion.png" alt="ki shell highlighting and completion" width="700" style={{verticalAlign: 'middle'}}/>

**Enter**キーを押すと、ki shellは入力された行を評価し、結果を出力します。式の値は、`res*`のような自動生成された名前の変数として出力されます。後で、実行するコードでそのような変数を使用できます。
入力された構造が不完全な場合（たとえば、条件はあるが本体がない`if`など）、シェルは3つのドットを出力し、残りの部分を予期します。

<img src="/img/ki-shell-results.png" alt="ki shell results" width="700" style={{verticalAlign: 'middle'}}/>

### 式の型の確認

複雑な式やよくわからないAPIの場合、ki shellは`:type`（または`:t`）コマンドを提供し、式の型を表示します。

<img src="/img/ki-shell-type.png" alt="ki shell type" width="700" style={{verticalAlign: 'middle'}}/>

### コードのロード

必要なコードが別の場所に保存されている場合、ki shellでコードをロードして使用する方法は2つあります。
* `:load`（または`:l`）コマンドでソースファイルをロードします。
* `:paste`（または`:p`）コマンドを使用して、貼り付けモードでコードスニペットをコピーして貼り付けます。

<img src="/img/ki-shell-load.png" alt="ki shell load file" width="700" style={{verticalAlign: 'middle'}}/>

`ls`コマンドは、利用可能なシンボル（変数と関数）を表示します。

### 外部依存関係の追加

標準ライブラリに加えて、ki shellは外部依存関係もサポートしています。
これにより、プロジェクト全体を作成せずに、サードパーティライブラリを試すことができます。

ki shellにサードパーティライブラリを追加するには、`:dependsOn`コマンドを使用します。デフォルトでは、ki shellはMaven Centralで動作しますが、`:repository`コマンドを使用してリポジトリを接続すると、他のリポジトリを使用できます。

<img src="/img/ki-shell-dependency.png" alt="ki shell external dependency" width="700" style={{verticalAlign: 'middle'}}/>