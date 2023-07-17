export default class Game
{ //по умолчанию экспорт Game
    score = 0; //количество очков
    lines = 0; //количество "собранных" строк
    field = new Array(20); // игровое поле 20x10 (20 строк, 10 столбцов)
    figure_move = this.create_next_figure_move();
    next_figure_move = this.create_next_figure_move();
    is_end_top = false;
    best_scores = [0, 0, 0, 0, 0];

    make_best_scores()
    {
        this.best_scores.pop();
        this.best_scores.push(this.score);
        this.best_scores.sort(function (a, b){return b - a});
        localStorage.setItem("best_scores", JSON.stringify(this.best_scores));
    }

    table_scores(best_scores)
    {
        if (localStorage.getItem("best_scores") === null || localStorage.getItem("best_scores") === undefined)
        {
            localStorage.setItem("best_scores", JSON.stringify(best_scores));
        }
        return  JSON.parse(localStorage.getItem("best_scores"));
    }

    get level()
    {
        return Math.floor(this.lines * 0.1); // лвл, который меняется каждые 10 уровней (0-9 - 1, 10-19 - 2 и тд)
    }

    restart()
    {
        this.score = 0;
        this.lines = 0;
        this.is_end_top = false;
        this.field = this.create_field();
        this.figure_move = this.create_next_figure_move();
        this.next_figure_move = this.create_next_figure_move();
    }

    update_score(deleted_lines)
    {
        //console.log(deleted_lines);
        const points =
            {
                '1' : 40,
                '2' : 100,
                '3' : 300,
                '4' : 1200
            };
        if (deleted_lines > 0)
        {
            this.score += points[deleted_lines] * (this.level + 1);
            this.lines += deleted_lines;
            //console.log(this.score, this.lines);
        }
    }

    delete_lines()
    {
        const rows = 20;
        const columns = 10;
        let lines = []; //массив строк, которые нужно удалить

        for (let y = rows - 1; y >= 0; y--)
        {
            let blocks_count = 0; //количесво непустых блоков на линии (строке)
            for (let x = 0; x < columns; x++)
            {
                if (this.field[y][x] !== 0)
                {
                    blocks_count++;
                    //console.log(blocks_count);
                }
            }
            if (blocks_count === 0) //если линия пуста, то блоков сверху нет
            {
                break;
            } else if (blocks_count < columns) //если линия не пуста, но полностью не заполнена
            {
                continue;
            } else //оставшийся вариант - линия заполнена
            {
                lines.unshift(y); //добавим индекс строки в начало
            }
        }
        //console.log(lines);

        for (let i of lines)
        {
            this.field.splice(i, 1); // удаляем заполненную линию
            this.field.unshift(new Array(columns).fill(0)); //добавляем пустую линию сверху поля
        }
        //console.log((lines.length));
        return lines.length;
    }

    create_next_figure_move()
    {
        const figure_number = Math.floor(Math.random() * 7); //получение числа от 0 до 7 (номер фигуры от 0 до 7)
        const figure_names = "IJLOSTZ"; //строка с именами фигур (1 буква = 1 имя)
        const figure = figure_names[figure_number]; //получение имени фигуры
        const figure_next = {};

        switch (figure)
        {
            case 'I':
                figure_next.blocks =
                [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0],
                ];
                break;
            case 'J':
                figure_next.blocks =
                    [
                        [0,0,0],
                        [2,2,2],
                        [0,0,2]
                    ];
                break;
            case 'L':
                figure_next.blocks =
                    [
                        [0,0,0],
                        [3,3,3],
                        [3,0,0]
                    ];
                break;
            case 'O':
                figure_next.blocks =
                    [
                        [0,0,0,0],
                        [0,4,4,0],
                        [0,4,4,0],
                        [0,0,0,0]
                    ];
                break;
            case 'S':
                figure_next.blocks =
                    [
                        [0,0,0],
                        [0,5,5],
                        [5,5,0]
                    ];
                break;
            case 'T':
                figure_next.blocks =
                    [
                        [0,0,0],
                        [6,6,6],
                        [0,6,0]
                    ];
                break;
            case 'Z':
                figure_next.blocks =
                    [
                        [0,0,0],
                        [7,7,0],
                        [0,7,7]
                    ];
                break;
            default:
                throw new Error("Неизвестная фигура!(");
        }

        figure_next.x = Math.floor((10 - figure_next.blocks[0].length)/2); //верхний центр (чтобы фигура падала с середины)
        figure_next.y = -1;
        return figure_next;
    }

    get_field()
    {
        const field = this.create_field(); //копия поля
        for (let y = 0; y < this.field.length; y++)
        {
            for (let x = 0; x < this.field[y].length; x++)
            {
                field[y][x] = this.field[y][x];
            }
        }

        for (let y = 0; y < this.figure_move.blocks.length; y++) //копия падающей фигуры на поле
        {
            for (let x = 0; x < this.figure_move.blocks[y].length; x++)
            {
                if (this.figure_move.blocks[y][x] !== 0)
                {
                    field[this.figure_move.y + y][this.figure_move.x + x] = this.figure_move.blocks[y][x];//координата+отступ
                }
            }
        }
        return{
            next_figure_move : this.next_figure_move,
            score : this.score,
            level: this.level,
            lines: this.lines,
            field,
            is_game_over : this.is_end_top
        };
    }

    create_field()
    {
        const field = new Array(this.field.length)
        for (let y = 0; y < field.length; y++)
        {
            field[y] = new Array(this.field[y].length);
            for (let x = 0; x < field[y].length; x++)
            {
                field[y][x] = 0;
            }
        }
        return field;
    }

    rotate_figure_left()
    {
        this.rotate_figure();
        this.rotate_figure();
        this.rotate_figure();
    }

    rotate_figure() //поворот падающей фигуры на 90 по часовой
    {
        const blocks = this.figure_move.blocks; //на случай выхода за границы или столкновений с другими фигурами
        const temp = new Array(this.figure_move.blocks.length); //массив для поворота фигуры
        for (let i = 0; i < temp.length; i++)
        {
            temp[i] = new Array(temp.length);
            for (let j = 0; j < temp[i].length; j++)
            {
                temp[i][j] = 0;
            }
        }

        for (let y = 0; y < temp.length; y++)
        {
            for (let x = 0; x < temp[y].length; x++)
            {
                temp[x][y] = this.figure_move.blocks[temp.length - 1 - y][x]; //замена строк на столбцы (поворот)
            }
        }
        this.figure_move.blocks = temp; //замена падающей фигуры на повернутую

        if (this.is_figure_out_of_bounds()) //в случае выхода за пределы
        {
            this.figure_move.blocks = blocks;
        }
    }

    is_figure_out_of_bounds()
    {
        for (let y = 0; y < this.figure_move.blocks.length; y++)
        {
            for (let x = 0; x < this.figure_move.blocks[y].length; x++)
            {
                if (this.figure_move.blocks[y][x] !== 0 && //если в поле фигуры 0, то все равно на пределы поля игры и другие фигуры
                    (this.field[this.figure_move.y + y] === undefined ||
                    this.field[this.figure_move.y + y][this.figure_move.x + x] === undefined ||
                    this.field[this.figure_move.y + y][this.figure_move.x + x] !== 0))
                {
                    return true;
                }
            }
        }
        return false;
    }

    insert_figure()
    {
        for (let y = 0; y < this.figure_move.blocks.length; y++)
        {
            for (let x = 0; x < this.figure_move.blocks[y].length; x++)
            {
                if (this.figure_move.blocks[y][x] !== 0) //нули фигуры не должны переписываться
                {
                    this.field[this.figure_move.y + y][this.figure_move.x + x] = this.figure_move.blocks[y][x];
                }
            }
        }
    }

    move_figure_left()
    {
        this.figure_move.x -= 1;
        if (this.is_figure_out_of_bounds())
        {
            this.figure_move.x += 1;
        }
    }

    move_figure_right()
    {
        this.figure_move.x += 1;
        if (this.is_figure_out_of_bounds())
        {
            this.figure_move.x -= 1;
        }
    }

    update_figures() //меняем падающую фигуру на следующую
    {
        this.figure_move = this.next_figure_move;
        this.next_figure_move = this.create_next_figure_move();
    }

    move_figure_down()
    {
        if (this.is_end_top)
        {
            return;
        }

        if (this.figure_move.y + 1 < 20)
        {
            this.figure_move.y += 1;
            if (this.is_figure_out_of_bounds())
            {
                this.figure_move.y -= 1;
                this.insert_figure();
                const deleted_lines = this.delete_lines();
                this.update_score(deleted_lines);
                this.update_figures();
            }
        }

        if (this.is_figure_out_of_bounds())
        {
            this.is_end_top = true;
        }
    }

    constructor()
    {
        for (let i = 0; i < this.field.length; i++)
        {
            this.field[i] = new Array(10);
            for (let j = 0; j < this.field[0].length; j++)
            {
                this.field[i][j] = 0;
            }
        }
    }
}