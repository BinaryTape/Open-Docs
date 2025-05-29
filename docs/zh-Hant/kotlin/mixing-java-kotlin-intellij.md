[//]: # (title: 在一個專案中混合使用 Java 和 Kotlin – 教程)

Kotlin 提供了與 Java 的一流互通性，而現代 IDE 則使其變得更好。在本教程中，您將學習如何在 IntelliJ IDEA 的同一個專案中同時使用 Kotlin 和 Java 原始碼。要了解如何在 IntelliJ IDEA 中啟動新的 Kotlin 專案，請參閱[開始使用 IntelliJ IDEA](jvm-get-started.md)。

## 將 Java 原始碼新增至現有的 Kotlin 專案

將 Java 類別新增至 Kotlin 專案相當直接。您只需建立一個新的 Java 檔案。在專案中選取一個目錄或套件，然後前往 **檔案** | **新增** | **Java 類別**，或使用 **Alt + Insert**/**Cmd + N** 快捷鍵。

![新增 Java 類別](new-java-class.png){width=400}

如果您已經有 Java 類別，可以直接將它們複製到專案目錄中。

您現在可以從 Kotlin 中取用該 Java 類別，反之亦然，無需任何額外操作。
 
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

讓您可以像在 Kotlin 中呼叫任何其他類型一樣，從 Kotlin 中呼叫它。

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 將 Kotlin 原始碼新增至現有的 Java 專案

將 Kotlin 檔案新增至現有的 Java 專案大致相同。

![新增 Kotlin 檔案類別](new-kotlin-file.png){width=400}

如果這是您首次將 Kotlin 檔案新增至此專案，IntelliJ IDEA 將自動新增所需的 Kotlin 執行時期。

![綑綁 Kotlin 執行時期](bundling-kotlin-option.png){width=350}

您也可以從 **工具** | **Kotlin** | **在專案中設定 Kotlin** 手動開啟 Kotlin 執行時期設定。

## 使用 J2K 將現有的 Java 檔案轉換為 Kotlin

Kotlin 外掛程式也綑綁了一個 Java 轉 Kotlin 轉換器 (_J2K_)，它可以自動將 Java 檔案轉換為 Kotlin。
若要對檔案使用 J2K，請在其右鍵選單或 IntelliJ IDEA 的 **程式碼** 選單中點擊 **將 Java 檔案轉換為 Kotlin 檔案**。

![將 Java 轉換為 Kotlin](convert-java-to-kotlin.png){width=500}

儘管該轉換器並非萬無一失，但它在將大部分 Java 樣板程式碼轉換為 Kotlin 方面做得相當不錯。然而，有時仍需要一些手動微調。