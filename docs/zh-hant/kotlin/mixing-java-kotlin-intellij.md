---
title: "在一個專案中混合使用 Java 和 Kotlin – 教學"
---
Kotlin 提供與 Java 的一流互通性，而現代的 IDE 使其更加出色。
在本教學中，您將學習如何在 IntelliJ IDEA 的同一個專案中使用 Kotlin 和 Java 原始碼。
要了解如何在 IntelliJ IDEA 中啟動新的 Kotlin 專案，請參閱 [Getting started with IntelliJ IDEA](jvm-get-started)。

## 將 Java 原始碼新增到現有的 Kotlin 專案

將 Java 類別新增到 Kotlin 專案非常簡單。您需要做的就是建立一個新的 Java 檔案。選擇專案中的目錄或套件，然後轉到 **File**（檔案）| **New**（新增）| **Java Class**（Java 類別），或使用 **Alt + Insert**/**Cmd + N** 捷徑。

<img src="/img/new-java-class.png" alt="Add new Java class" width="400" style={{verticalAlign: 'middle'}}/>

如果您已經有 Java 類別，則只需將它們複製到專案目錄中即可。

現在，您可以從 Kotlin 使用 Java 類別，反之亦然，而無需執行任何其他操作。

例如，新增以下 Java 類別：

``` java
public class Customer {

    private String name;

    public Customer(String s){
        name = s;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void placeOrder() {
        System.out.println("A new order is placed by " + name);
    }
}
```

讓您可以像在 Kotlin 中使用任何其他類型一樣從 Kotlin 呼叫它。

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 將 Kotlin 原始碼新增到現有的 Java 專案

將 Kotlin 檔案新增到現有的 Java 專案幾乎相同。

<img src="/img/new-kotlin-file.png" alt="Add new Kotlin file class" width="400" style={{verticalAlign: 'middle'}}/>

如果這是您第一次將 Kotlin 檔案新增到此專案，IntelliJ IDEA 將自動新增所需的 Kotlin 執行時函式庫（Kotlin runtime）。

<img src="/img/bundling-kotlin-option.png" alt="Bundling Kotlin runtime" width="350" style={{verticalAlign: 'middle'}}/>

您也可以從 **Tools**（工具）| **Kotlin** | **Configure Kotlin in Project**（在專案中配置 Kotlin）手動開啟 Kotlin 執行時函式庫配置。

## 使用 J2K 將現有的 Java 檔案轉換為 Kotlin

Kotlin 外掛程式還捆綁了一個 Java 到 Kotlin 轉換器（Java to Kotlin converter，_J2K_），可以自動將 Java 檔案轉換為 Kotlin。
要在檔案上使用 J2K，請在其上下文選單或 IntelliJ IDEA 的 **Code**（程式碼）選單中點擊 **Convert Java File to Kotlin File**（將 Java 檔案轉換為 Kotlin 檔案）。

<img src="/img/convert-java-to-kotlin.png" alt="Convert Java to Kotlin" width="500" style={{verticalAlign: 'middle'}}/>

雖然轉換器並非萬無一失，但它在將大多數樣板程式碼從 Java 轉換為 Kotlin 方面做得相當不錯。
但是，有時需要進行一些手動調整。