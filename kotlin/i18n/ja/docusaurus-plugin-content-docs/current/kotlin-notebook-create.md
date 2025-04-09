---
title: "初めての Kotlin Notebook を作成する"
---
:::info
<p>
   これは、<strong>Kotlin Notebook 入門</strong>チュートリアルの第2部です。続行する前に、前のステップを完了していることを確認してください。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env">環境をセットアップする</a><br/>
      <img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>Kotlin Notebook を作成する</strong><br/>
      <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> Kotlin Notebook に依存関係を追加する<br/>
</p>

:::

ここでは、最初の[Kotlin Notebook](kotlin-notebook-overview)を作成し、簡単な操作を実行し、コードセルを実行する方法を学びます。

## 空のプロジェクトを作成する

1. IntelliJ IDEA で、**File | New | Project** を選択します。
2. 左側のパネルで、**New Project** を選択します。
3. 新しいプロジェクトに名前を付け、必要に応じて場所を変更します。

   > 新しいプロジェクトをバージョン管理下に置くには、**Create Git repository** チェックボックスを選択します。
   > 後でいつでも実行できます。
   > 
   

4. **Language** リストから、**Kotlin** を選択します。

   <img src="/img/new-notebook-project.png" alt="Create a new Kotlin Notebook project" width="700" style={{verticalAlign: 'middle'}}/>

5. **IntelliJ** ビルドシステムを選択します。
6. **JDK list** から、プロジェクトで使用する [JDK](https://www.oracle.com/java/technologies/downloads/) を選択します。
7. **Add sample code** オプションを有効にして、サンプル `"Hello World!"` アプリケーションを含むファイルを作成します。

   > **Generate code with onboarding tips** オプションを有効にして、サンプルコードに追加の役立つコメントを追加することもできます。
   > 
   

8. **Create** をクリックします。

## Kotlin Notebook を作成する

1. 新しいノートブックを作成するには、**File | New | Kotlin Notebook** を選択するか、フォルダーを右クリックして **New | Kotlin Notebook** を選択します。

   <img src="/img/new-notebook.png" alt="Create a new Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

2. 新しいノートブックの名前（たとえば、**first-notebook**）を設定し、**Enter** を押します。
   Kotlin Notebook **first-notebook.ipynb** の新しいタブが開きます。
3. 開いたタブで、次のコードをコードセルに入力します。

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4. コードセルを実行するには、**Run Cell and Select Below** <img src="/img/run-cell-and-select-below.png" alt="Run Cell and Select Below" width="30" style={{verticalAlign: 'middle'}}/> ボタンをクリックするか、**Shift** + **Return** を押します。
5. **Add Markdown Cell** ボタンをクリックして、markdown cell を追加します。
6. セルに `# Example operations` と入力し、コードセルを実行するのと同じように実行してレンダリングします。
7. 新しいコードセルに `10 + 10` と入力し、実行します。
8. コードセルで変数を定義します。たとえば、`val a = 100` とします。

   > 定義された変数を含むコードセルを実行すると、それらの変数は他のすべてのコードセルでアクセス可能になります。
   > 
   

9. 新しいコードセルを作成し、`println(a * a)` を追加します。
10. **Run All** <img src="/img/run-all-button.png" alt="Run all button" width="30" style={{verticalAlign: 'middle'}}/> ボタンを使用して、ノートブック内のすべてのコードセルと markdown cell を実行します。

    <img src="/img/first-notebook.png" alt="First notebook" width="700" style={{verticalAlign: 'middle'}}/>

おめでとうございます！最初の Kotlin Notebook を作成しました。

## スクラッチ Kotlin Notebook を作成する

IntelliJ IDEA 2024.1.1 以降では、Kotlin Notebook をスクラッチファイルとして作成することもできます。

[Scratch files](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file) を使用すると、
新しいプロジェクトを作成したり、既存のプロジェクトを変更したりせずに、小さなコードをテストできます。

スクラッチ Kotlin Notebook を作成するには：

1. **File | New | Scratch File** をクリックします。
2. **New Scratch File** リストから **Kotlin Notebook** を選択します。

   <img src="/img/kotlin-notebook-scratch-file.png" alt="Scratch notebook" width="400" style={{verticalAlign: 'middle'}}/>

## 次のステップ

チュートリアルの次のパートでは、Kotlin Notebook に依存関係を追加する方法を学びます。

**[次の章に進む](kotlin-notebook-add-dependencies)**