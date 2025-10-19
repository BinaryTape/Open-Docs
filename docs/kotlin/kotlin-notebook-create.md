[//]: # (title: 创建你的第一个 Kotlin Notebook)

<tldr>
   <p>这是《**Kotlin Notebook 入门**》教程的第二部分。在继续之前，请确保你已完成上一步。</p>
   <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="kotlin-notebook-set-up-env.md">设置环境</a><br/>
      <img src="icon-2.svg" width="20" alt="第二步"/> <strong>创建 Kotlin Notebook</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="第三步"/> 向 Kotlin Notebook 添加依赖项<br/>
  </p>
</tldr>

你可以通过三种主要方式开始使用你的 [Kotlin Notebook](kotlin-notebook-overview.md)：

* [创建包含 Kotlin Notebook 的新项目](#create-a-new-project)
* [向现有项目添加 Kotlin Notebook](#add-a-new-kotlin-notebook-to-your-project)
* [创建临时 Kotlin Notebook](#create-a-scratch-kotlin-notebook)

## 创建新项目

要创建包含 Kotlin Notebook 的新项目：

1. 在 IntelliJ IDEA 的欢迎屏幕中，从左侧面板选择 **Kotlin Notebook** | **New Notebook**。
2. 为你的新 Notebook 输入一个 **Name**，并选择 **Type** | **In Folder**。
   * **Scratch:** 此选项用于创建临时 Notebook，而无需将其添加到项目中。
   * **In Folder:** 此选项用于在项目中创建 Notebook。你必须指定项目的位置。
3. 点击 **Create**。

![从 IntelliJ IDEA 创建新的 Kotlin Notebook](create-notebook-welcome.png){width=700}

你的新 Kotlin Notebook 已在新项目中创建。

另外，你也可以先创建一个空项目，然后[添加 Kotlin Notebook](#add-a-new-kotlin-notebook-to-your-project)：

1. 在 IntelliJ IDEA 中，选择 **File | New | Project**。
2. 在左侧面板中，选择 **New Project**。
3. 命名新项目，如有必要，更改其位置。

   > 选中 **Create Git repository** 复选框以将新项目置于版本控制之下。
   > 你可以随时在以后执行此操作。
   >
   {style="tip"}

4. 从 **Language** 列表中，选择 **Kotlin**。

   ![创建新的 Kotlin Notebook 项目](new-notebook-project.png){width=700}

5. 选择 **IntelliJ** 构建系统。
6. 从 **JDK** 列表中，选择你希望在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
7. 启用 **Add sample code** 选项以创建一个包含示例“Hello World!”应用程序的文件。

   > 你还可以启用 **Generate code with onboarding tips** 选项，向示例代码添加一些额外的有用注释。
   >
   {style="tip"}

8. 点击 **Create**。

项目创建后，添加一个新的 Kotlin Notebook（请参阅下一节）。

## 向项目添加新的 Kotlin Notebook

要向现有项目添加新的 Kotlin Notebook：

1. 选择 **File | New | Kotlin Notebook**，或右键点击文件夹并选择 **New | Kotlin Notebook**。

   ![创建新的 Kotlin Notebook](new-notebook.png){width=700}

2. 设置新 Notebook 的名称，例如 **first-notebook**。
3. 按下 **Enter** 键。一个带有 Kotlin Notebook **first-notebook.ipynb** 的新选项卡将打开。

## 创建临时 Kotlin Notebook

你还可以将 Kotlin Notebook 创建为临时文件。[临时文件](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file) 允许你测试小段代码，而无需创建新项目或修改现有项目。

要创建临时 Kotlin Notebook：

1. 点击 **File | New | Scratch File**。
2. 从 **New Scratch File** 列表中选择 **Kotlin Notebook**。

   ![临时 notebook](kotlin-notebook-scratch-file.png){width=400}

## 执行基本操作

1. 在新的 Kotlin Notebook 中，在代码单元格中输入以下代码：

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```

2. 要运行代码单元格，请点击 **Run Cell and Select Below** ![运行单元格并选择下方](run-cell-and-select-below.png){width=30}{type="joined"} 按钮或按下 **Shift** + **Return** 键。
3. 通过点击 **Add Markdown Cell** 按钮添加 Markdown 单元格。
4. 在单元格中输入 `# Example operations`，并以运行代码单元格的相同方式运行它以进行渲染。
5. 在新的代码单元格中，输入 `10 + 10` 并运行它。
6. 在代码单元格中定义变量。例如，`val a = 100`。

   > 一旦你运行了包含定义变量的代码单元格，这些变量将在所有其他代码单元格中变得可访问。
   >
   {style="tip"}

7. 创建新的代码单元格并添加 `println(a * a)`。
8. 使用 **Run All** ![全部运行按钮](run-all-button.png){width=30}{type="joined"} 按钮运行 Notebook 中的所有代码和 Markdown 单元格。

   ![第一个 Notebook](first-notebook.png){width=700}

恭喜！你已成功创建并尝试了你的第一个 Kotlin Notebook。

## 下一步

在教程的下一部分，你将学习如何向 Kotlin Notebook 添加依赖项。

**[继续下一章](kotlin-notebook-add-dependencies.md)**