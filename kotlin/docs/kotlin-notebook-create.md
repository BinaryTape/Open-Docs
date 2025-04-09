---
title: "创建你的第一个 Kotlin Notebook"
---
:::info
<p>
   这是 <strong>Kotlin Notebook 入门</strong>教程的第二部分。在继续之前，请确保已完成上一步。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env">配置环境</a><br/>
      <img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>创建 Kotlin Notebook</strong><br/>
      <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> 向 Kotlin Notebook 添加依赖项<br/>
</p>

:::

在这里，你将学习如何创建你的第一个 [Kotlin Notebook](kotlin-notebook-overview)，执行简单的操作，并运行代码单元（code cell）。

## 创建一个空项目

1. 在 IntelliJ IDEA 中，选择 **File | New | Project**。
2. 在左侧面板中，选择 **New Project**。
3. 命名新项目，并在必要时更改其位置。

   > 选中 **Create Git repository** 复选框，将新项目置于版本控制之下。
   > 你也可以稍后随时进行此操作。
   > 
   

4. 从 **Language** 列表中，选择 **Kotlin**。

   <img src="/img/new-notebook-project.png" alt="Create a new Kotlin Notebook project" width="700" style={{verticalAlign: 'middle'}}/>

5. 选择 **IntelliJ** 构建系统。
6. 从 **JDK list** 列表中，选择要在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
7. 启用 **Add sample code** 选项以创建一个包含示例 `"Hello World!"` 应用程序的文件。

   > 你还可以启用 **Generate code with onboarding tips** 选项以向示例代码添加一些额外的有用注释。
   > 
   

8. 点击 **Create**。

## 创建一个 Kotlin Notebook

1. 要创建新的 Notebook，选择 **File | New | Kotlin Notebook**，或者右键单击文件夹并选择 **New | Kotlin Notebook**。

   <img src="/img/new-notebook.png" alt="Create a new Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

2. 设置新 Notebook 的名称，例如，**first-notebook**，然后按 **Enter**。
   将打开一个带有 Kotlin Notebook **first-notebook.ipynb** 的新标签页。
3. 在打开的选项卡中，在代码单元（code cell）中键入以下代码：

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4. 要运行代码单元（code cell），请单击 **Run Cell and Select Below** <img src="/img/run-cell-and-select-below.png" alt="Run Cell and Select Below" width="30" style={{verticalAlign: 'middle'}}/> 按钮或按 **Shift** + **Return**。
5. 通过单击 **Add Markdown Cell** 按钮添加一个 Markdown 单元（markdown cell）。
6. 在单元格中键入 `# Example operations`，并以运行代码单元（code cell）相同的方式运行它以进行渲染。
7. 在新的代码单元（code cell）中，键入 `10 + 10` 并运行它。
8. 在代码单元（code cell）中定义一个变量。例如，`val a = 100`。

   > 运行带有已定义变量的代码单元（code cell）后，这些变量即可在所有其他代码单元（code cell）中访问。
   > 
   

9. 创建一个新的代码单元（code cell）并添加 `println(a * a)`。
10. 使用 **Run All** <img src="/img/run-all-button.png" alt="Run all button" width="30" style={{verticalAlign: 'middle'}}/> 按钮运行 Notebook 中的所有代码和 Markdown 单元（markdown cell）。

    <img src="/img/first-notebook.png" alt="First notebook" width="700" style={{verticalAlign: 'middle'}}/>

恭喜！你刚刚创建了你的第一个 Kotlin Notebook。

## 创建一个临时的 Kotlin Notebook（scratch Kotlin Notebook）

从 IntelliJ IDEA 2024.1.1 开始，你还可以创建一个 Kotlin Notebook 作为草稿文件（scratch file）。

[草稿文件（Scratch files）](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file) 允许你测试小段代码，而无需创建新项目或修改现有项目。

要创建临时的 Kotlin Notebook（scratch Kotlin Notebook）：

1. 点击 **File | New | Scratch File**。
2. 从 **New Scratch File** 列表中选择 **Kotlin Notebook**。

   <img src="/img/kotlin-notebook-scratch-file.png" alt="Scratch notebook" width="400" style={{verticalAlign: 'middle'}}/>

## 下一步

在本教程的下一部分中，你将学习如何向 Kotlin Notebook 添加依赖项。

**[进入下一章](kotlin-notebook-add-dependencies)**