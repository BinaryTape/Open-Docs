[//]: # (title: 在一個專案中混用 Java 與 Kotlin – 教學)

Kotlin 提供了與 Java 的一流互通性，而現代 IDE 讓這點變得更好。
在本教學中，您將學習如何在 IntelliJ IDEA 的同一個專案中使用 Kotlin 和 Java 原始碼。
要了解如何在 IntelliJ IDEA 中啟動新的 Kotlin 專案，請參閱 [IntelliJ IDEA 入門](jvm-get-started.md)。

## 將 Java 原始碼新增至現有的 Kotlin 專案

將 Java 類別新增至 Kotlin 專案相當簡單。您只需建立一個新的 Java 檔案。
選取專案中的目錄或套件，然後前往 **File** | **New** | **Java Class** 或使用 **Alt + Insert**/**Cmd + N** 快捷鍵。

![新增 Java 類別](new-java-class.png){width=400}

如果您已經有 Java 類別，只需將它們複製到專案目錄即可。

您現在可以從 Kotlin 中使用 Java 類別，反之亦然，而無需任何進一步動作。

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

讓您可以像 Kotlin 中的任何其他類型一樣從 Kotlin 呼叫它。

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 將 Kotlin 原始碼新增至現有的 Java 專案

將 Kotlin 檔案新增至現有的 Java 專案大致相同。

![新增 Kotlin 檔案類別](new-kotlin-file.png){width=400}

如果這是您首次將 Kotlin 檔案新增至此專案，IntelliJ IDEA 將會自動新增所需的 Kotlin 執行環境。

![捆綁 Kotlin 執行環境](bundling-kotlin-option.png){width=350}

您也可以從 **Tools** | **Kotlin** | **Configure Kotlin in Project** 手動開啟 Kotlin 執行環境配置。

## 使用 J2K 將現有的 Java 檔案轉換為 Kotlin

Kotlin 外掛也捆綁了一個 Java 到 Kotlin 的轉換器（_J2K_），它會自動將 Java 檔案轉換為 Kotlin。
要在檔案上使用 J2K，請點擊其上下文選單或 IntelliJ IDEA 的 **Code** 選單中的 **Convert Java File to Kotlin File**。

![將 Java 轉換為 Kotlin](convert-java-to-kotlin.png){width=500}

雖然這個轉換器並非萬無一失，但它在將大部分 Java 樣板程式碼轉換為 Kotlin 方面做得相當不錯。
不過，有時仍然需要一些手動調整。