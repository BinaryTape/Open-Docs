[//]: # (title: 创建你的第一个 Kotlin Notebook)

<tldr>
   <p>这是 **Kotlin Notebook 入门**教程的第二部分。在继续之前，请确保你已完成上一步。</p>
   <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="kotlin-notebook-set-up-env.md">设置环境</a><br/>
      <img src="icon-2.svg" width="20" alt="第二步"/> <strong>创建 Kotlin Notebook</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="第三步"/> 向 Kotlin Notebook 添加依赖项<br/>
  </p>
</tldr>

在这里，你将学习如何创建你的第一个 [Kotlin Notebook](kotlin-notebook-overview.md)，执行简单操作并运行代码单元格。

## 创建空项目

1. 在 IntelliJ IDEA 中，选择 **File | New | Project**。
2. 在左侧面板中，选择 **New Project**。
3. 为新项目命名，并根据需要更改其位置。

   > 选中 **Create Git repository** 复选框可将新项目置于版本控制之下。
   > 你可以随时在以后进行此操作。
   >
   {style="tip"}

4. 从 **Language** 列表中，选择 **Kotlin**。

   ![创建新的 Kotlin Notebook 项目](new-notebook-project.png){width=700}

5. 选择 **IntelliJ** 构建系统。
6. 从 **JDK** 列表中，选择你希望在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
7. 启用 **Add sample code** 选项以创建包含示例 `"Hello World!"` 应用程序的文件。

   > 你还可以启用 **Generate code with onboarding tips** 选项，为你的示例代码添加一些额外的有用注释。
   >
   {style="tip"}

8. 点击 **Create**。

## 创建 Kotlin Notebook

1. 要创建新的 Notebook，选择 **File | New | Kotlin Notebook**，或右键点击文件夹并选择 **New | Kotlin Notebook**。

   ![创建新的 Kotlin Notebook](new-notebook.png){width=700}

2. 设置新 Notebook 的名称，例如 **first-notebook**，然后按下 **Enter** 键。
   一个带有 Kotlin Notebook **first-notebook.ipynb** 的新标签页将打开。
3. 在打开的标签页中，在代码单元格中输入以下代码：

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4. 要运行代码单元格，点击 **Run Cell and Select Below** ![Run Cell and Select Below](run-cell-and-select-below.png){width=30}{type="joined"} 按钮或按下 **Shift** + **Return**。
5. 通过点击 **Add Markdown Cell** 按钮添加一个 Markdown 单元格。
6. 在单元格中输入 `# Example operations`，然后以运行代码单元格的相同方式运行它以进行渲染。
7. 在一个新的代码单元格中，输入 `10 + 10` 并运行它。
8. 在一个代码单元格中定义一个变量。例如，`val a = 100`。

   > 一旦你运行了包含定义变量的代码单元格，这些变量就可以在所有其他代码单元格中访问。
   >
   {style="tip"}

9. 创建一个新的代码单元格并添加 `println(a * a)`。
10. 使用 **Run All** ![Run all button](run-all-button.png){width=30}{type="joined"} 按钮运行 Notebook 中的所有代码和 Markdown 单元格。

    ![第一个 notebook](first-notebook.png){width=700}

恭喜！你已经成功创建了你的第一个 Kotlin Notebook。

## 创建临时 Kotlin Notebook

从 IntelliJ IDEA 2024.1.1 开始，你还可以将 Kotlin Notebook 创建为临时文件。

[临时文件](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file) 允许你在不创建新项目或修改现有项目的情况下测试小段代码。

要创建临时 Kotlin Notebook：

1. 点击 **File | New | Scratch File**。
2. 从 **New Scratch File** 列表中选择 **Kotlin Notebook**。

   ![临时 notebook](kotlin-notebook-scratch-file.png){width=400}

## 下一步

在本教程的下一部分中，你将学习如何向 Kotlin Notebook 添加依赖项。

**[继续下一章](kotlin-notebook-add-dependencies.md)**