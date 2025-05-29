[//]: # (title: 初めてのKotlin Notebookを作成する)

<tldr>
   <p>これは**Kotlin Notebook入門**チュートリアルの第二部です。進む前に、前のステップを完了していることを確認してください。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">環境をセットアップする</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>Kotlin Notebookを作成する</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> Kotlin Notebookに依存関係を追加する<br/>
  </p>
</tldr>

ここでは、初めての[Kotlin Notebook](kotlin-notebook-overview.md)を作成し、簡単な操作を行い、コードセルを実行する方法を学びます。

## 空のプロジェクトを作成する

1. IntelliJ IDEAで、**File | New | Project**を選択します。
2. 左側のパネルで、**New Project**を選択します。
3. 新しいプロジェクトに名前を付け、必要であればその場所を変更します。

   > **Create Git repository**チェックボックスを選択すると、新しいプロジェクトがバージョン管理下に置かれます。これは後からいつでも行うことができます。
   >
   {style="tip"}

4. **Language**リストから、**Kotlin**を選択します。

   ![Create a new Kotlin Notebook project](new-notebook-project.png){width=700}

5. **IntelliJ**ビルドシステムを選択します。
6. **JDK**リストから、プロジェクトで使用したい[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
7. サンプルの`"Hello World!"`アプリケーションを含むファイルを作成するために、**Add sample code**オプションを有効にします。

   > **Generate code with onboarding tips**オプションを有効にすると、サンプルコードにさらに役立つコメントを追加できます。
   >
   {style="tip"}

8. **Create**をクリックします。

## Kotlin Notebookを作成する

1. 新しいノートブックを作成するには、**File | New | Kotlin Notebook**を選択するか、フォルダーを右クリックして**New | Kotlin Notebook**を選択します。

   ![Create a new Kotlin Notebook](new-notebook.png){width=700}

2. 新しいノートブックの名前を設定します（例: **first-notebook**）と入力し、**Enter**を押します。Kotlin Notebook **first-notebook.ipynb**の新しいタブが開きます。
3. 開いたタブで、コードセルに以下のコードを入力します。

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4. コードセルを実行するには、**Run Cell and Select Below** ![Run Cell and Select Below](run-cell-and-select-below.png){width=30}{type="joined"}ボタンをクリックするか、**Shift** + **Return**を押します。
5. **Add Markdown Cell**ボタンをクリックしてMarkdownセルを追加します。
6. セルに`# Example operations`と入力し、コードセルを実行するのと同じ方法で実行してレンダリングします。
7. 新しいコードセルに`10 + 10`と入力して実行します。
8. コードセルで変数を定義します。例: `val a = 100`。

   > 定義された変数を含むコードセルを実行すると、それらの変数は他のすべてのコードセルでアクセス可能になります。
   >
   {style="tip"}

9. 新しいコードセルを作成し、`println(a * a)`を追加します。
10. **Run All** ![Run all button](run-all-button.png){width=30}{type="joined"}ボタンを使用して、ノートブック内のすべてのコードセルとMarkdownセルを実行します。

    ![First notebook](first-notebook.png){width=700}

おめでとうございます！初めてのKotlin Notebookが作成できました。

## スクラッチKotlin Notebookを作成する

IntelliJ IDEA 2024.1.1以降では、Kotlin Notebookをスクラッチファイルとして作成することもできます。

[スクラッチファイル](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file)を使用すると、新しいプロジェクトを作成したり既存のプロジェクトを変更したりすることなく、小さなコードをテストできます。

スクラッチKotlin Notebookを作成するには：

1. **File | New | Scratch File**をクリックします。
2. **New Scratch File**リストから**Kotlin Notebook**を選択します。

   ![Scratch notebook](kotlin-notebook-scratch-file.png){width=400}

## 次のステップ

チュートリアルの次のパートでは、Kotlin Notebookに依存関係を追加する方法を学びます。

**[次の章へ進む](kotlin-notebook-add-dependencies.md)**