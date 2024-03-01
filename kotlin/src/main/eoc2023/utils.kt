import java.io.File
import java.lang.Exception

fun readFile(name: String): String = File("resources", name).readText()
fun readFileLines(name: String): List<String> = File("resources", name).readLines()
