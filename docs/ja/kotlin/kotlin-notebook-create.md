[//]: # (title: 最初のKotlin Notebookを作成する)

<tldr>
   <p>これは**Kotlin Notebook入門**チュートリアルの第2部です。続行する前に、前のステップを完了していることを確認してください。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">環境をセットアップする</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>Kotlin Notebookを作成する</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> Kotlin Notebookに依存関係を追加する<br/>
  </p>
</tldr>

ここでは、[Kotlin Notebook](kotlin-notebook-overview.md)を初めて作成し、簡単な操作を実行し、コードセルを実行する方法を学びます。

## 空のプロジェクトを作成する

1.  IntelliJ IDEAで、**File | New | Project**を選択します。
2.  左側のパネルで、**New Project**を選択します。
3.  新しいプロジェクトに名前を付け、必要に応じて場所を変更します。

   > 新しいプロジェクトをバージョン管理下に置くには、**Create Git repository**チェックボックスを選択します。
   > これはいつでも後で行うことができます。
   >
   {style="tip"}

4.  **Language**リストから、**Kotlin**を選択します。

   ![Create a new Kotlin Notebook project](new-notebook-project.png){width=700}

5.  **IntelliJ**ビルドシステムを選択します。
6.  **JDK**リストから、プロジェクトで使用したい[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
7.  サンプル"`Hello World!"`アプリケーションを含むファイルを作成するには、**Add sample code**オプションを有効にします。

   > サンプルコードに役立つコメントを追加するには、**Generate code with onboarding tips**オプションを有効にすることもできます。
   >
   {style="tip"}

8.  **Create**をクリックします。

## Kotlin Notebookを作成する

1.  新しいノートブックを作成するには、**File | New | Kotlin Notebook**を選択するか、フォルダを右クリックして**New | Kotlin Notebook**を選択します。

   ![Create a new Kotlin Notebook](new-notebook.png){width=700}

2.  新しいノートブックの名前（例：**first-notebook**）を設定し、**Enter**を押します。
    Kotlin Notebookの新しいタブ**first-notebook.ipynb**が開きます。
3.  開いているタブで、コードセルに次のコードを入力します。

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4.  コードセルを実行するには、**Run Cell and Select Below** ![Run Cell and Select Below](run-cell-and-select-below.png){width=30}{type="joined"}ボタンをクリックするか、**Shift** + **Return**を押します。
5.  **Add Markdown Cell**ボタンをクリックしてMarkdownセルを追加します。
6.  セルに`# Example operations`と入力し、コードセルを実行するのと同じ方法で実行してレンダリングします。
7.  新しいコードセルに`10 + 10`と入力して実行します。
8.  コードセルで変数を定義します。例えば、`val a = 100`。

   > 定義された変数を含むコードセルを実行すると、それらの変数は他のすべてのコードセルからアクセス可能になります。
   >
   {style="tip"}

9.  新しいコードセルを作成し、`println(a * a)`を追加します。
10. **Run All** ![Run all button](run-all-button.png){width=30}{type="joined"}ボタンを使用して、ノートブック内のすべてのコードセルとMarkdownセルを実行します。

    ![First notebook](first-notebook.png){width=700}

おめでとうございます！初めてのKotlin Notebookを作成しました。

## スクラッチKotlin Notebookを作成する

IntelliJ IDEA 2024.1.1以降、スクラッチファイルとしてKotlin Notebookを作成することもできます。

[スクラッチファイル](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file)を使用すると、新しいプロジェクトを作成したり既存のプロジェクトを変更したりすることなく、小さなコード片をテストできます。

スクラッチKotlin Notebookを作成するには：

1.  **File | New | Scratch File**をクリックします。
2.  **New Scratch File**リストから**Kotlin Notebook**を選択します。

   ![Scratch notebook](kotlin-notebook-scratch-file.png){width=400}

## 次のステップ

チュートリアルの次のパートでは、Kotlin Notebookに依存関係を追加する方法を学びます。

**[次の章に進む](kotlin-notebook-add-dependencies.md)**